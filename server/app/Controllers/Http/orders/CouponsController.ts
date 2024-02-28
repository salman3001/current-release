import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Coupon from 'App/Models/orders/Coupon'
import BaseController from '../BaseController'
import CouponCreateValidator from 'App/Validators/CouponCreateValidator'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import { CouponType } from 'App/Helpers/enums'
import AdminUser from 'App/Models/adminUser/AdminUser'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CouponsController extends BaseController {
  constructor() {
    super(Coupon, CouponCreateValidator, CouponCreateValidator, 'CouponPolicy')
  }

  public async vendorCoupons({ bouncer, auth, response, request }: HttpContextContract) {
    await bouncer.with('CouponPolicy').authorize('vendorList')

    let coupons: Coupon[] = []

    const couponQuery = Coupon.query()
      .where('vendor_user_id', auth.user!.id)
      .where('coupon_type', CouponType.VENDOR)

    this.indexfilterQuery(request.qs() as any, couponQuery)

    if (request.qs().populate) {
      await this.populate(request.qs().populate, couponQuery)
    }

    if (request.qs().page) {
      coupons = await couponQuery.paginate(request.qs().page, request.qs().perPage || this.perPage)
    } else {
      coupons = await couponQuery.exec()
    }

    return response.custom({
      code: 200,
      message: null,
      data: coupons,
      success: true,
    })
  }

  public async index({ bouncer, auth, response, request }: HttpContextContract) {
    await bouncer.with('CouponPolicy').authorize('viewList')

    let coupons: Coupon[] = []

    const couponQuery = Coupon.query().where('coupon_type', CouponType.ADMIN)

    this.indexfilterQuery(request.qs() as any, couponQuery)

    if (request.qs().populate) {
      await this.populate(request.qs().populate, couponQuery)
    }

    if (request.qs().page) {
      coupons = await couponQuery.paginate(request.qs().page, request.qs().perPage || this.perPage)
    } else {
      coupons = await couponQuery.exec()
    }

    return response.custom({
      code: 200,
      message: null,
      data: coupons,
      success: true,
    })
  }

  public async store({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('CouponPolicy').authorize('create')

    const payload = await request.validate(CouponCreateValidator)

    const user = auth.user
    let couponType: CouponType | null = null
    let vendorUserId: number | null = null

    if (user instanceof VendorUser) {
      couponType = CouponType.VENDOR
      vendorUserId = user.id
    }

    if (user instanceof AdminUser) {
      couponType = CouponType.ADMIN
      vendorUserId = null
    }

    let coupon: any = null

    await Database.transaction(async (trx) => {
      coupon = await Coupon.create(
        { ...payload, vendorUserId: vendorUserId, couponType: couponType as any },
        { client: trx }
      )
    })

    if (coupon) {
      await coupon.refresh()
    }

    return response.custom({
      code: 201,
      data: coupon,
      message: 'Coupon created Successfully',
      success: true,
    })
  }

  public async update({ auth, response, bouncer, request, params }: HttpContextContract) {
    const coupon = await Coupon.findOrFail(+params.id)
    await bouncer.with('CouponPolicy').authorize('update', coupon)

    const payload = await request.validate(CouponCreateValidator)

    const user = auth.user
    let couponType: CouponType | null = null

    if (user instanceof VendorUser) {
      couponType = CouponType.VENDOR
    }

    if (user instanceof AdminUser) {
      couponType = CouponType.ADMIN
    }

    await Database.transaction(async (trx) => {
      coupon.useTransaction(trx)
      coupon.merge({ ...payload, couponType: couponType as any })
      await coupon.save()
    })

    if (coupon) {
      await coupon.refresh()
    }

    return response.custom({
      code: 201,
      data: coupon,
      message: 'Coupon Updated Successfully',
      success: true,
    })
  }

  // public async applyToServices({ response, bouncer, request, params }: HttpContextContract) {
  //   const coupon = await Coupon.findOrFail(+params.id)
  //   await bouncer.with('CouponPolicy').authorize('update', coupon)

  //   const validationSchema = schema.create({
  //     serviceIds: schema.array().members(schema.number()),
  //   })

  //   const payload = await request.validate({ schema: validationSchema })

  //   await coupon.related('services').attach(payload.serviceIds)

  //   return response.custom({
  //     code: 201,
  //     data: coupon,
  //     message: 'Coupon applied Successfully',
  //     success: true,
  //   })
  // }

  public async updateServices({ response, bouncer, request, params }: HttpContextContract) {
    const coupon = await Coupon.findOrFail(+params.id)

    await bouncer.with('CouponPolicy').authorize('update', coupon)

    const validationSchema = schema.create({
      serviceIds: schema.array().members(schema.number()),
    })

    const payload = await request.validate({ schema: validationSchema })

    await coupon.related('services').detach()

    await coupon.related('services').attach(payload.serviceIds)

    return response.custom({
      code: 201,
      data: coupon,
      message: 'Coupon applied Successfully',
      success: true,
    })
  }
}
