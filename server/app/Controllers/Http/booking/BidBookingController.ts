import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import BidBookingCreateValidator from 'App/Validators/Booking/BidBookingCreateValidator'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import Bid from 'App/Models/bid/Bid'
import { OrderStatus } from 'App/Helpers/enums'
import { schema } from '@ioc:Adonis/Core/Validator'
import BidBooking from 'App/Models/bookings/BidBooking'
import BigNumber from 'bignumber.js'
import User from 'App/Models/user/User'

export default class BidBookingController extends BaseController {
  constructor() {
    super(BidBooking, BidBookingCreateValidator, BidBookingCreateValidator, 'BidBookingPolicy')
  }

  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('BidBookingPolicy').authorize('myList')

    const user = auth.user!

    let bidBooking: BidBooking[] = []

    const bidBookingQuery = BidBooking.query()

    if (user instanceof VendorUser) {
      bidBookingQuery.where('vendor_user_id', user.id)
    }

    if (user instanceof User) {
      bidBookingQuery.where('user_id', user.id)
    }

    this.indexfilterQuery(request.qs() as any, bidBookingQuery)

    if (request.qs().page) {
      bidBooking = await bidBookingQuery.paginate(
        request.qs().page,
        request.qs().rowsPerPage || this.perPage
      )
    } else {
      bidBooking = await bidBookingQuery.exec()
    }

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bidBooking,
    })
  }

  public async store({ response, bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('BidBookingPolicy').authorize('create')

    const payload = await request.validate(BidBookingCreateValidator)

    const serviceRequirement = await ServiceRequirement.findOrFail(payload.serviceRequirementId)

    if (!serviceRequirement.acceptedBidId) {
      return response.custom({
        code: 400,
        message: 'No Bid is accepted to place the order',
        data: null,
        success: false,
      })
    }

    const acceptedBid = await Bid.findOrFail(serviceRequirement.acceptedBidId)

    const price = new BigNumber(acceptedBid.offeredPrice).times(payload.qty)

    const bidBooking = await BidBooking.create({
      price: price.toFixed(2),
      qty: payload.qty,
      status: OrderStatus.PLACED,
      userId: auth.user?.id,
      vendorUserId: acceptedBid.vendorUserId,
      paymentDetail: payload.paymentdetail,
      bookingDetail: {
        serviceRequirement: {
          id: serviceRequirement.id,
          title: serviceRequirement.title,
          desc: serviceRequirement.desc,
          budgetType: serviceRequirement.budgetType,
          budget: serviceRequirement.budget,
        },
        acceptedBid: {
          id: acceptedBid.id,
          offeredPrice: acceptedBid.offeredPrice,
        },
      },
    })

    return response.custom({
      code: 201,
      message: 'Bid Order Created',
      data: bidBooking,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const bidBooking = await BidBooking.findOrFail(+params.id)

    await bouncer.with('BidBookingPolicy').authorize('update', bidBooking)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
    })

    const payload = await request.validate({ schema: validationSchema })

    bidBooking.merge({ status: payload.status })

    await bidBooking.save()

    return response.custom({
      code: 201,
      message: 'Bid Order Status Updated',
      data: bidBooking,
      success: true,
    })
  }
}
