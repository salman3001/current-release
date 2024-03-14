import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import ServiceRequirementCreateValidator from 'App/Validators/bid/ServiceRequirementCreateValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Bid from 'App/Models/bid/Bid'
import Service from 'App/Models/service/Service'

export default class ServiceRequirementController extends BaseController {
  constructor() {
    super(
      ServiceRequirement,
      ServiceRequirementCreateValidator,
      ServiceRequirementCreateValidator,
      'ServiceRequirementPolicy'
    )
  }

  public getIndexQuery(ctx: HttpContextContract): ModelQueryBuilderContract<any, any> {
    return ServiceRequirement.query().whereNull('accepted_bid_id')
  }

  public async myList({ auth, response, bouncer, request }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('myList')

    const user = auth.user!

    let serviceRequirement: ServiceRequirement[] = []

    const serviceRequirementQuery = ServiceRequirement.query().where('user_id', user.id)

    this.indexfilterQuery(request.qs() as any, serviceRequirementQuery)

    if (request.qs().page) {
      serviceRequirement = await serviceRequirementQuery.paginate(
        request.qs().page,
        request.qs().perPage || this.perPage
      )
    } else {
      serviceRequirement = await serviceRequirementQuery.exec()
    }

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

    const bidQuery = Bid.query().where('id', serviceRequirement.acceptedBidId)

    this.indexfilterQuery(request.qs() as any, bidQuery)

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

    const bidQuery = Bid.query().where('service_requirement_id', serviceRequirement.id)

    this.indexfilterQuery(request.qs() as any, bidQuery)

    let bids: Bid[] | null = null

    if (request.qs().page) {
      bids = await bidQuery.paginate(request.qs().page, request.qs().rowsPerPage || this.perPage)
    } else {
      bids = await bidQuery.exec()
    }

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

  public async acceptBid({ bouncer, request, response, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    if (serviceRequirement.acceptedBidId) {
      return response.custom({
        code: 400,
        message: 'You have already accepted a bid',
        data: null,
        success: false,
      })
    }
    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const validationSchema = schema.create({
      bidId: schema.number(),
    })

    const payload = await request.validate({ schema: validationSchema })

    await Database.transaction(async (trx) => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ acceptedBidId: payload.bidId })
      await serviceRequirement.save()
    })

    await serviceRequirement.refresh()

    return response.custom({
      code: 200,
      message: 'bid Accepted',
      data: serviceRequirement,
      success: true,
    })
  }

  public async rejectBid({ bouncer, request, response, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    if (!serviceRequirement.acceptedBidId) {
      return response.custom({
        code: 400,
        message: 'You have not accepted any bid',
        data: null,
        success: false,
      })
    }

    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    await Database.transaction(async (trx) => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ acceptedBidId: null })
      await serviceRequirement.save()
    })

    await serviceRequirement.refresh()

    return response.custom({
      code: 200,
      message: 'bid Rejected',
      data: serviceRequirement,
      success: true,
    })
  }
}
