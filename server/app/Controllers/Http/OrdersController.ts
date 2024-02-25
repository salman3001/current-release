// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Order from 'App/Models/Order'
import BaseController from './BaseController'
import OrderCreateValidator from 'App/Validators/OrderCreateValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/user/User'
import Cart from 'App/Models/user/Cart'
import { OrderStatus } from 'App/Helpers/enums'
import Database from '@ioc:Adonis/Lucid/Database'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import { schema } from '@ioc:Adonis/Core/Validator'

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

  public async summary({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('create')
    const user = auth.user as User
    const cart = await Cart.query()
      .where('user_id', user.id)
      .preload('items', (item) => {
        item.preload('serviceVariant', (variant) => {
          variant.select('name', 'service_id', 'price').preload('service', (service) => {
            service.select('name', 'business_id').preload('business', (business) => {
              business.select('name', 'id', 'vendor_user_id').preload('vendor')
            })
          })
        })
      })
      .first()

    const orders = this.groupOrdersByVendor(cart)

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

    await Database.transaction(async (trx) => {
      const cart = await Cart.query({ client: trx })
        .where('user_id', user.id)
        .preload('items', (item) => {
          item.preload('serviceVariant', (variant) => {
            variant.select('name', 'service_id', 'price').preload('service', (service) => {
              service.select('name', 'business_id').preload('business', (business) => {
                business.select('name', 'id', 'vendor_user_id').preload('vendor')
              })
            })
          })
        })
        .first()

      const orderGroup = this.groupOrdersByVendor(cart)

      for (const order of orderGroup.orders) {
        Order.create(
          {
            userId: auth.user?.id,
            vendorUserId: order.vendorId,
            total: order.orderTotal,
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

  public groupOrdersByVendor(cart: Cart | null) {
    let groupedItems = {}

    if (cart) {
      groupedItems = cart.items.reduce((result, item) => {
        const vendorId = item.serviceVariant.service.business.vendor.id

        if (!result[vendorId]) {
          result[vendorId] = {
            vendorId,
            items: [
              {
                qty: item.qty,
                serviceVariant: {
                  service_id: item.serviceVariant.service.id,
                  service_name: item.serviceVariant.service.name,
                  id: item.serviceVariant.id,
                  name: item.serviceVariant.name,
                  price: item.serviceVariant.price,
                },
                itemTotal: (item.qty * item.serviceVariant.price).toFixed(2),
              },
            ],
            orderTotal: item.qty * item.serviceVariant.price,
          }
        } else {
          // Increment total price for the order
          result[vendorId].items.push({
            qty: item.qty,
            serviceVariant: {
              service_id: item.serviceVariant.service.id,
              service_name: item.serviceVariant.service.name,
              id: item.serviceVariant.id,
              name: item.serviceVariant.name,
              price: item.serviceVariant.price,
            },
            itemTotal: (item.qty * item.serviceVariant.price).toFixed(2),
          })
          result[vendorId].orderTotal += item.qty * item.serviceVariant.price
        }

        return result
      }, {})
    }

    let grandTotal = 0
    const orders = Object.values(groupedItems).map((group: any, i) => {
      grandTotal += group.orderTotal
      return { orderNo: i + 1, ...group }
    })

    return {
      orders,
      grandTotal: grandTotal.toFixed(2),
    } as unknown as {
      orders: { vendorId: number; items: []; orderNo: number; orderTotal: number }[]
      grandTotal: number
    }
  }
}
