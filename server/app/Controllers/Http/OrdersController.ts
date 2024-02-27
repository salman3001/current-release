// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Order from 'App/Models/Order'
import BaseController from './BaseController'
import OrderCreateValidator from 'App/Validators/OrderCreateValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/user/User'
import Cart from 'App/Models/user/Cart'
import { CouponType, DiscountType, OrderStatus } from 'App/Helpers/enums'
import Database from '@ioc:Adonis/Lucid/Database'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import { schema } from '@ioc:Adonis/Core/Validator'
import CartItem from 'App/Models/user/CartItem'
import BigNumber from 'bignumber.js'
import Coupon from 'App/Models/Coupon'

export default class OrdersController extends BaseController {
  constructor() {
    super(Order, OrderCreateValidator, OrderCreateValidator, 'OrderPolicy')
  }

  public async myOrders({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('ownList')

    const user = auth.user!

    let orders: Order[] = []

    if (user instanceof User) {
      const orderQuery = Order.query().where('user_id', user.id)
      this.indexfilterQuery(request.qs() as any, orderQuery)
      if (request.qs().populate) {
        await this.populate(request.qs().populate as any, orderQuery)
      }

      if (request.qs().page) {
        orders = await orderQuery.paginate(request.qs().page, request.qs().page || this.perPage)
      } else {
        orders = await orderQuery.exec()
      }
    }

    if (user instanceof VendorUser) {
      const orderQuery = Order.query().where('vendor_user_id', user.id)
      this.indexfilterQuery(request.qs() as any, orderQuery)
      if (request.qs().populate) {
        await this.populate(request.qs().populate as any, orderQuery)
      }

      if (request.qs().page) {
        orders = await orderQuery.paginate(request.qs().page, request.qs().page || this.perPage)
      } else {
        orders = await orderQuery.exec()
      }
    }

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: orders,
    })
  }

  public async summary({ response, bouncer, auth, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')
    const user = auth.user as User
    const cart = await Cart.query()
      .where('user_id', user.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.preload('service', (service) => {
            service.select('name', 'business_id').preload('business', (business) => {
              business.select('name', 'id', 'vendor_user_id').preload('vendor')
            })
          })
        })
      })
      .first()

    const couponId = request.body().couponId

    const orders = await this.groupOrdersByVendor(cart, couponId)

    return response.custom({
      code: 200,
      message: null,
      data: orders,
      success: true,
    })
  }

  public async store({ response, auth, bouncer, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')
    const payload = await request.validate(OrderCreateValidator)
    const user = auth.user as User

    const cart = await Cart.query()
      .where('user_id', user.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.preload('service', (service) => {
            service.select('name', 'business_id').preload('business', (business) => {
              business.select('name', 'id', 'vendor_user_id').preload('vendor')
            })
          })
        })
      })
      .first()

    if (cart!.items.length < 1) {
      return response.custom({
        code: 400,
        message: 'Cart must contain atleast 01 item',
        data: null,
        success: false,
      })
    }

    await Database.transaction(async (trx) => {
      cart?.useTransaction(trx)
      const { grand_total, orders } = await this.groupOrdersByVendor(cart)

      if (grand_total)
        for (const order of orders) {
          Order.create(
            {
              userId: auth.user?.id,
              vendorUserId: order.vendorId,
              total: order.order_total,
              status: OrderStatus.PLACED,
              orderDetail: order.items,
              paymentDetail: payload.paymentdetail,
            },
            { client: trx }
          )
        }

      for (const item of cart!.items) {
        await item.delete()
      }
    })

    return response.custom({
      code: 201,
      message: 'Order created successfully',
      data: null,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const order = await Order.findOrFail(+params.id)
    await bouncer.with('OrderPolicy').authorize('update', order)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
    })

    const payload = await request.validate({ schema: validationSchema })

    await Database.transaction(async (trx) => {
      order.useTransaction(trx)
      order.merge({ status: payload.status })
      await order.save()
    })

    await order.refresh()

    return response.custom({
      code: 200,
      message: 'Order status updated',
      data: order,
      success: true,
    })
  }

  public async getCoupons({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')

    const cart = await Cart.query()
      .where('user_id', auth.user!.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.select('id', 'service_id').preload('service', (service) => {
            service.select('id')
          })
        })
      })
      .first()

    const serviceIds = this.getServiceIdsfromCart(cart!)

    const coupons = await Coupon.query()
      .whereHas('services', (service) => {
        service.whereIn('services.id', serviceIds)
      })
      .orWhere('coupon_type', CouponType.ADMIN)

    return response.custom({
      code: 200,
      message: 'Order status updated',
      data: coupons,
      success: true,
    })
  }

  public async groupOrdersByVendor(cart: Cart | null, couponId: number) {
    let groupedItems = {}

    let coupon: Coupon | null = null
    if (couponId) {
      coupon = await Coupon.query()
        .where('id', couponId)
        .preload('services', (services) => {
          services.select('id')
        })
        .first()
    }

    if (cart) {
      groupedItems = cart.items.reduce((result, item) => {
        const vendorId = item.serviceVariant.service.business.vendor.id

        const item_total_without_discount = new BigNumber(item.qty).times(item.serviceVariant.price)

        const discount_type = item.serviceVariant.discountType

        const total_percentage_discount = item_total_without_discount
          .times(item.serviceVariant.discountPercentage)
          .dividedBy(100)

        const item_total_discount_applied =
          discount_type === DiscountType.FLAT
            ? new BigNumber(item.serviceVariant.discountFlat)
            : discount_type === DiscountType.PERCENATAGE
              ? total_percentage_discount
              : new BigNumber(0)

        const item_total = item_total_without_discount.minus(item_total_discount_applied)

        if (!result[vendorId]) {
          result[vendorId] = {
            vendorId,
            items: [
              {
                qty: item.qty,
                serviceVariant: {
                  service_id: item.serviceVariant.service.id,
                  service_name: item.serviceVariant.service.name,
                  disocunt_type: item.serviceVariant.discountType,
                  disocunt_flat: item.serviceVariant.discountFlat,
                  disocunt_percentage: item.serviceVariant.discountPercentage,
                  id: item.serviceVariant.id,
                  name: item.serviceVariant.name,
                  price: item.serviceVariant.price,
                },
                item_total_without_discount: item_total_without_discount.toFixed(2),
                item_total_discount_applied: item_total_discount_applied.toFixed(2),
                item_total: item_total.toFixed(2),
              },
            ],
            order_total_without_discount: item_total_without_discount.toFixed(2),
            order_total_discount_applied: item_total_discount_applied.toFixed(2),
            coupon_discount_applied: '0.00',
            order_total: item_total.toFixed(2),
          }
        } else {
          // Increment total price for the order
          result[vendorId].items.push({
            qty: item.qty,
            serviceVariant: {
              service_id: item.serviceVariant.service.id,
              service_name: item.serviceVariant.service.name,
              disocunt_type: item.serviceVariant.discountType,
              disocunt_flat: item.serviceVariant.discountFlat,
              disocunt_percentage: item.serviceVariant.discountPercentage,
              id: item.serviceVariant.id,
              name: item.serviceVariant.name,
              price: item.serviceVariant.price,
            },
            item_total_discount_applied: item_total_discount_applied.toFixed(2),
            item_total_without_discount: item_total_without_discount.toFixed(2),
            item_total: item_total.toFixed(2),
          })

          result[vendorId].order_total_without_discount = new BigNumber(
            result[vendorId].order_total_without_discount
          )
            .plus(item_total_without_discount)
            .toFixed(2)

          result[vendorId].order_total_discount_applied = new BigNumber(
            result[vendorId].order_total_discount_applied
          )
            .plus(item_total_discount_applied)
            .toFixed(2)

          result[vendorId].coupon_discount_applied = '0.00'

          result[vendorId].order_total = new BigNumber(result[vendorId].order_total)
            .plus(item_total)
            .toFixed(2)
        }

        return result
      }, {})
    }

    let total_discount_applied = new BigNumber(0)
    let total_coupon_discount_applied = new BigNumber(0)
    let grand_total = new BigNumber(0)

    const orders = Object.values(groupedItems).map((group: any, i) => {
      const groupVendorId = group.vendorId

      if (coupon?.couponType == CouponType.VENDOR && coupon.vendorUserId == groupVendorId) {
        let coupan_discount_amount = new BigNumber(0)

        if (coupon.discountType == DiscountType.FLAT) {
          coupan_discount_amount = coupan_discount_amount.plus(coupon.discountFlat)
          console.log(coupan_discount_amount.toFixed(2))
        }

        if (coupon.discountType == DiscountType.PERCENATAGE) {
          const percentage = new BigNumber(coupon.discountPercentage)
          coupan_discount_amount = coupan_discount_amount.plus(
            percentage.dividedBy(100).times(group.order_total)
          )
        }

        group.order_total = new BigNumber(group.order_total)
          .minus(coupan_discount_amount)
          .toFixed(2)
        group.coupon_discount_applied = coupan_discount_amount.toFixed()

        total_coupon_discount_applied = total_coupon_discount_applied.plus(coupan_discount_amount)
      }

      grand_total = grand_total.plus(group.order_total)
      total_discount_applied = total_discount_applied.plus(group.order_total_discount_applied)

      return { orderNo: i + 1, ...group }
    })

    if (coupon?.couponType == CouponType.ADMIN) {
      let coupan_discount_amount = new BigNumber(0)

      if (coupon.discountType == DiscountType.FLAT) {
        coupan_discount_amount = coupan_discount_amount.plus(coupon.discountFlat)
      }

      if (coupon.discountType == DiscountType.PERCENATAGE) {
        const percentage = new BigNumber(coupon.discountPercentage)
        coupan_discount_amount = coupan_discount_amount.plus(
          percentage.dividedBy(100).times(grand_total)
        )
      }

      grand_total = new BigNumber(grand_total).minus(coupan_discount_amount)

      total_coupon_discount_applied = total_coupon_discount_applied.plus(coupan_discount_amount)
    }

    return {
      total_discount_applied: total_discount_applied.toFixed(2),
      total_coupon_discount_applied: total_coupon_discount_applied.toFixed(2),
      grand_total: grand_total.toFixed(2),
      orders,
    } as unknown as {
      orders: { vendorId: number; items: []; orderNo: number; order_total: number }[]
      grand_total: number
      total_coupon_discount_applied: number
    }
  }

  public getServiceIdsfromCart(cart: Cart) {
    const serviceIds: number[] = []

    if (cart?.items) {
      for (const item of cart.items) {
        if (!serviceIds.includes(item.serviceVariant.service.id)) {
          serviceIds.push(item.serviceVariant.service.id)
        }
      }
    }

    return serviceIds
  }
}
