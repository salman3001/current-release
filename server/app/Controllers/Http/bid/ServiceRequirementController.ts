import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import ServiceRequirementCreateValidator from 'App/Validators/bid/ServiceRequirementCreateValidator'
import Database from '@ioc:Adonis/Lucid/Database'

import Bid from 'App/Models/bid/Bid'
import BaseApiController from '../BaseApiController'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class ServiceRequirementController extends BaseApiController {

  public extraFilters(modelQuery: ModelQueryBuilderContract<typeof ServiceRequirement, ServiceRequirement>, qs: Record<string, any>): void {
    if (qs.where_accepted_bid_id) {
      modelQuery.where('accepted_bid_id', qs.where_accepted_bid_id)
    }
    if (qs.where_expires_at_lt) {
      modelQuery.where('expires_at', '<', qs.where_expires_at_lt)
    }
    if (qs.where_expires_at_gt) {
      modelQuery.where('expires_at', '>', qs.where_expires_at_gt)
    }
  }

  public async index({ response, bouncer, request }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('viewList')

    const serviceRequirementQuery = ServiceRequirement.query()

    this.applyFilters(serviceRequirementQuery, request.qs())

    const serviceRequirements = await this.paginate(request, serviceRequirementQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceRequirements,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {

    const serviceRequirement = await ServiceRequirement.query().where('id', +params.id).preload('serviceCategory', s => {
      s.select('name')
    }).withCount('recievedBids').withAggregate('recievedBids', b => {
      b.avg('offered_price').as('avgBidPrice')
    }).firstOrFail()

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceRequirement,
    })
  }


  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('myList')

    const user = auth.user!

    const serviceRequirementQuery = ServiceRequirement.query().where('user_id', user.id).preload('serviceCategory', s => {
      s.select(['name'])
    }).withCount('recievedBids').withAggregate('recievedBids', b => {
      b.avg('offered_price').as('avgBidPrice')
    })

    this.applyFilters(serviceRequirementQuery, request.qs() as any)

    const serviceRequirement = await this.paginate(request, serviceRequirementQuery)

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: serviceRequirement,
    })
  }

  public async showAcceptedBid({ bouncer, params, response, request }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    const bidQuery = Bid.query().where('id', serviceRequirement.acceptedBidId || 0).preload('vendorUser', v => {
      v.select([
        "first_name",
        "last_name",
        "id",
        "avg_rating",
        "business_name",
      ])
    })

    const bid = await bidQuery.first()

    return response.custom({
      code: 200,
      message: null,
      data: bid,
      success: true,
    })
  }

  public async showBids({ bouncer, params, response, request }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    const bidQuery = Bid.query().where('service_requirement_id', serviceRequirement.id).preload('vendorUser', v => {
      v.select('avg_rating')
    })

    if (request.qs()?.orderby_avg_rating) {
      bidQuery.join("vendor_users", "bids.vendor_user_id", "vendor_users.id")
      bidQuery.whereNot('bids.id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.select('bids.*')
      bidQuery.orderBy('vendor_users.avg_rating', 'desc')
    }

    if (request.qs()?.orderby_lowest_price) {
      bidQuery.whereNot('id', serviceRequirement?.acceptedBidId || 0)
      bidQuery.orderBy('offered_price', 'asc')
      bidQuery.select('*')
    }

    this.applyFilters(bidQuery, request.qs())

    const bids = await this.paginate(request, bidQuery)

    return response.custom({
      code: 200,
      message: null,
      data: bids,
      success: true,
    })
  }

  public async store({ auth, bouncer, request, response }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('create')

    const payload = await request.validate(ServiceRequirementCreateValidator)

    let serviceRequirement: ServiceRequirement | null = null

    await Database.transaction(async (trx) => {
      serviceRequirement = await ServiceRequirement.create(
        { ...payload, userId: auth.user!.id },
        { client: trx }
      )
    })

    if (serviceRequirement) {
      await (serviceRequirement as ServiceRequirement).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Service requirement created',
      data: serviceRequirement,
      success: true,
    })
  }

  public async update({ auth, bouncer, request, response, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)
    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const payload = await request.validate(ServiceRequirementCreateValidator)

    await Database.transaction(async (trx) => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ ...payload, userId: auth.user!.id })
      await serviceRequirement.save()
    })

    await serviceRequirement.refresh()

    return response.custom({
      code: 200,
      message: 'Service requirement update',
      data: serviceRequirement,
      success: true,
    })
  }

  // public async acceptBid({ bouncer, request, response, params }: HttpContextContract) {
  //   const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

  //   if (serviceRequirement.acceptedBidId) {
  //     return response.custom({
  //       code: 400,
  //       message: 'You have already accepted a bid',
  //       data: null,
  //       success: false,
  //     })
  //   }
  //   await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

  //   const validationSchema = schema.create({
  //     bidId: schema.number(),
  //   })

  //   const payload = await request.validate({ schema: validationSchema })

  //   await Database.transaction(async (trx) => {
  //     serviceRequirement.useTransaction(trx)
  //     serviceRequirement.merge({ acceptedBidId: payload.bidId })
  //     await serviceRequirement.save()
  //   })

  //   await serviceRequirement.refresh()

  //   return response.custom({
  //     code: 200,
  //     message: 'bid Accepted',
  //     data: serviceRequirement,
  //     success: true,
  //   })
  // }

  // public async rejectBid({ bouncer, request, response, params }: HttpContextContract) {
  //   const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

  //   if (!serviceRequirement.acceptedBidId) {
  //     return response.custom({
  //       code: 400,
  //       message: 'You have not accepted any bid',
  //       data: null,
  //       success: false,
  //     })
  //   }

  //   await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

  //   await Database.transaction(async (trx) => {
  //     serviceRequirement.useTransaction(trx)
  //     serviceRequirement.merge({ acceptedBidId: null })
  //     await serviceRequirement.save()
  //   })

  //   await serviceRequirement.refresh()

  //   return response.custom({
  //     code: 200,
  //     message: 'bid Rejected',
  //     data: serviceRequirement,
  //     success: true,
  //   })
  // }
}
