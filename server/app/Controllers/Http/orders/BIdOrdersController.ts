import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BidOrder from 'App/Models/orders/BidOrder'
import BaseController from '../BaseController'
import BidOrderCreateValidator from 'App/Validators/Booking/BidBookingCreateValidator'
import VendorUser from 'App/Models/vendorUser/VendorUser'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import Database from '@ioc:Adonis/Lucid/Database'
import Bid from 'App/Models/bid/Bid'
import { OrderStatus } from 'App/Helpers/enums'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class BidOrdersController extends BaseController {
  constructor() {
    super(BidOrder, BidOrderCreateValidator, BidOrderCreateValidator, 'BidOrderPolicy')
  }

  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('OrderPolicy').authorize('customerList')

    const user = auth.user!

    let bidOrders: BidOrder[] = []

    const bidOrdersQuery = BidOrder.query()

    if (user instanceof VendorUser) {
      bidOrdersQuery.where('vendor_user_id', user.id)
    }

    if (user instanceof VendorUser) {
      bidOrdersQuery.where('user_id', user.id)
    }

    this.indexfilterQuery(request.qs() as any, bidOrdersQuery)
    if (request.qs().populate) {
      await this.populate(request.qs().populate as any, bidOrdersQuery)
    }

    if (request.qs().page) {
      bidOrders = await bidOrdersQuery.paginate(
        request.qs().page,
        request.qs().perPage || this.perPage
      )
    } else {
      bidOrders = await bidOrdersQuery.exec()
    }

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: bidOrders,
    })
  }

  public async store({ response, bouncer, request, auth }: HttpContextContract) {
    await bouncer.with('BidOrderPolicy').authorize('create')

    const payload = await request.validate(BidOrderCreateValidator)

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

    let bidOrder: BidOrder | null = null

    await Database.transaction(async (trx) => {
      bidOrder = await BidOrder.create({
        price: acceptedBid.offeredPrice,
        status: OrderStatus.PLACED,
        userId: auth.user?.id,
        vendorUserId: acceptedBid.vendorUserId,
        paymentDetail: payload.paymentdetail,
        orderDetail: {
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
    })

    if (bidOrder) {
      await (bidOrder as BidOrder).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Bid Order Created',
      data: bidOrder,
      success: true,
    })
  }

  public async updateStatus({ response, bouncer, request, params }: HttpContextContract) {
    const bidOrder = await BidOrder.findOrFail(+params.id)

    await bouncer.with('BidOrderPolicy').authorize('update', bidOrder)

    const validationSchema = schema.create({
      status: schema.enum(Object.values(OrderStatus)),
    })

    const payload = await request.validate({ schema: validationSchema })

    bidOrder.merge({ status: payload.status })

    await bidOrder.save()

    return response.custom({
      code: 201,
      message: 'Bid Order Status Updated',
      data: bidOrder,
      success: true,
    })
  }
}
