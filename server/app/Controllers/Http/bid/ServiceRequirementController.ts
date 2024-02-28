import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'
import ServiceRequirementCreateValidator from 'App/Validators/bid/ServiceRequirementCreateValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Bid from 'App/Models/bid/Bid'

export default class ServiceRequirementController extends BaseController {
  constructor() {
    super(ServiceRequirement, ServiceRequirementCreateValidator, ServiceRequirementCreateValidator, 'ServiceRequirementPolicy')
  }

  public getIndexQuery(ctx: HttpContextContract): ModelQueryBuilderContract<any, any> {
    return ServiceRequirement.query().whereNull('accepted_bid_id')
  }

  public async showAcceptedBid({ bouncer, params, response }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)

    await bouncer.with('ServiceRequirementPolicy').authorize('view', serviceRequirement)

    const bid = await Bid.query().where('id', serviceRequirement.acceptedBidId).preload('vendorUser').exec()

    return response.custom({
      code: 200,
      message: null,
      data: bid,
      success: true
    })
  }

  public async store({ auth, bouncer, request, response }: HttpContextContract) {
    await bouncer.with('ServiceRequirementPolicy').authorize('create')

    const payload = await request.validate(ServiceRequirementCreateValidator)

    let serviceRequirement: ServiceRequirement | null = null

    await Database.transaction(async trx => {
      serviceRequirement = await ServiceRequirement.create({ ...payload, userId: auth.user!.id }, { client: trx })
    })

    if (serviceRequirement) {
      await (serviceRequirement as ServiceRequirement).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Service requirement created',
      data: serviceRequirement,
      success: true
    })

  }

  public async update({ auth, bouncer, request, response, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)
    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const payload = await request.validate(ServiceRequirementCreateValidator)



    await Database.transaction(async trx => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ ...payload, userId: auth.user!.id })
      await serviceRequirement.save()
    })

    await serviceRequirement.refresh()

    return response.custom({
      code: 200,
      message: 'Service requirement update',
      data: serviceRequirement,
      success: true
    })

  }

  public async acceptBid({ bouncer, request, response, params }: HttpContextContract) {
    const serviceRequirement = await ServiceRequirement.findOrFail(+params.id)
    await bouncer.with('ServiceRequirementPolicy').authorize('update', serviceRequirement)

    const validationSchema = schema.create({
      bidId: schema.number()
    })

    const payload = await request.validate({ schema: validationSchema })



    await Database.transaction(async trx => {
      serviceRequirement.useTransaction(trx)
      serviceRequirement.merge({ acceptedBidId: payload.bidId })
      await serviceRequirement.save()
    })

    await serviceRequirement.refresh()

    return response.custom({
      code: 200,
      message: 'bid Accepted',
      data: serviceRequirement,
      success: true
    })

  }

}
