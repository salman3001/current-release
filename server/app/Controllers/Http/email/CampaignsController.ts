import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Campaign from 'App/Models/email/Campaign'
import Template from 'App/Models/email/Template'
import CreateCampaignValidator from 'App/Validators/news-letter/CreateCampaignValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class CampaignsController extends BaseController {
  constructor() {
    super(Campaign, CreateCampaignValidator, CreateCampaignValidator, 'CampaignPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('create')

    const payload = await request.validate(CreateCampaignValidator)
    const campaign = await Campaign.create(payload.campaign)

    if (payload.interests) {
      await campaign.related('interests').attach(payload.interests)
    }

    if (payload.templateId) {
      const template = await Template.findBy('id', payload.templateId)
      if (template) {
        await campaign.related('template').save(template)
      }
    }

    return response.json({ message: 'record created', data: campaign })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('CampaignPolicy').authorize('update')

    const campaign = await Campaign.findOrFail(+params.id)
    const payload = await request.validate(CreateCampaignValidator)

    campaign.merge(payload.campaign)
    await campaign.save()

    if (payload.interests) {
      await campaign.related('interests').detach()
      await campaign.related('interests').attach(payload.interests)
    }

    if (payload.templateId) {
      await campaign.load('template')

      if (campaign.template) {
        console.log(campaign.template.id != payload.templateId)
        if (campaign.template.id != payload.templateId) {
          await campaign.template.related('campaign').dissociate()
          await campaign.refresh()
          const template = await Template.findBy('id', payload.templateId)
          if (template) {
            await campaign.related('template').save(template)
          }
        }
      } else {
        const template = await Template.findBy('id', payload.templateId)
        if (template) {
          await campaign.related('template').save(template)
        }
      }
    }

    return response.json({ message: 'record created', data: campaign })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    const deliveryDate = DateTime.fromISO(rest.deliveryDateTime).toFormat('dd/MM/yyyy HH:mm') //=> '2014 Aug 06'
    return { ...rest, deliveryDateTime: deliveryDate }
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CreateCampaignValidator(ctx).schema,
      data: {
        campaign: data,
      },
    })

    await Campaign.updateOrCreate({ id: validatedData.campaign!.id }, validatedData.campaign!)
  }
}
