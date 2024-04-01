import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import Database from '@ioc:Adonis/Lucid/Database'
import Bid from 'App/Models/bid/Bid'
import BidValidator from 'App/Validators/bid/BidValidator'
import ServiceRequirement from 'App/Models/bid/ServiceRequirement'

export default class BidController extends BaseController {
  constructor() {
    super(Bid, BidValidator, BidValidator, 'BidPolicy')
  }

  public async index({ request, response, auth, bouncer }: HttpContextContract) {
    await bouncer.with('BidPolicy').authorize('viewList')

    let bids: Bid[] = []

    const bidsQuery = Bid.query().where('vendor_user_id', auth.user!.id)

    this.indexfilterQuery(request.qs() as any, bidsQuery)

    if (request.qs().page) {
      bids = await bidsQuery.paginate(request.qs().page, request.qs().rowsPerPage || this.perPage)
    } else {
      bids = await bidsQuery.exec()
    }

    return response.custom({
      code: 200,
      message: null,
      data: bids,
      success: true,
    })
  }

  public async store({ auth, bouncer, request, response }: HttpContextContract) {
    await bouncer.with('BidPolicy').authorize('create')

    const payload = await request.validate(BidValidator)

    const serviceRequirment = await ServiceRequirement.query()
      .where('id', payload.serviceRequirementId)
      .whereHas('recievedBids', (r) => {
        r.whereHas('vendorUser', (v) => {
          v.where('id', auth.user!.id)
        })
      })
      .first()

    if (serviceRequirment) {
      return response.custom({
        code: 400,
        message: 'You have already sent proposal for this requirement',
        data: null,
        success: false,
      })
    }

    let bid: Bid | null = null

    await Database.transaction(async (trx) => {
      bid = await Bid.create({ ...payload, vendorUserId: auth.user!.id }, { client: trx })
    })

    if (bid) {
      await (bid as Bid).refresh()
    }

    return response.custom({
      code: 201,
      message: 'Bid placed',
      data: bid,
      success: true,
    })
  }

  public async update({ auth, bouncer, request, response, params }: HttpContextContract) {
    const bid = await Bid.findOrFail(+params.id)
    await bouncer.with('BidPolicy').authorize('update', bid)

    const payload = await request.validate(BidValidator)

    await Database.transaction(async (trx) => {
      bid.useTransaction(trx)
      bid.merge({ ...payload, vendorUserId: auth.user!.id })
      await bid.save()
    })

    await bid.refresh()

    return response.custom({
      code: 200,
      message: 'Bid updated',
      data: bid,
      success: true,
    })
  }
}
