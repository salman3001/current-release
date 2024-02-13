import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CampaignType from 'App/Models/email/CampaignType'
import BaseController from '../BaseController'

export default class CampaignTypesController extends BaseController {
  constructor() {
    super(CampaignType, {}, {}, 'CampaignPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('create')
    const payload = await request.validate({} as any)
    const record = await CampaignType.create(payload)
    return response.json({ message: 'record created', data: record })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('update')
    const campaignType = await CampaignType.findOrFail(+params.id)
    const payload = await request.validate({} as any)
    campaignType.merge(payload)
    await campaignType.save()
    return response.json({ message: 'record updated', campaignType })
  }
}
