import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Subscriber from 'App/Models/email/Subscriber'
import CreateSubscriberValidator from 'App/Validators/news-letter/CreateSubscriberValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class SubscribersController extends BaseController {
  constructor() {
    super(Subscriber, CreateSubscriberValidator, CreateSubscriberValidator, 'SubscriberPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('SubscriberPolicy').authorize('create')

    const payload = await request.validate(CreateSubscriberValidator)
    const subscriber = await Subscriber.create(payload.subscriber)

    if (payload.interests) {
      await subscriber.related('interests').attach(payload.interests)
    }

    return response.custom({
      message: 'Subscriber Created',
      code: 201,
      data: subscriber,
      status: true,
      alertType: 'success'
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('SubscriberPolicy').authorize('update')

    const subscriber = await Subscriber.findOrFail(+params.id)
    const payload = await request.validate(CreateSubscriberValidator)

    subscriber.merge(payload.subscriber)
    await subscriber.save()

    if (payload.interests) {
      await subscriber.related('interests').detach()
      await subscriber.related('interests').attach(payload.interests)
    }

    return response.custom({
      message: 'Subscriber Updated',
      code: 201,
      data: subscriber,
      status: true,
      alertType: 'success'
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    const dob = DateTime.fromISO(rest.dob).toFormat('dd/MM/yyyy') //=> '2014 Aug 06'
    return { ...rest, dob }
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CreateSubscriberValidator(ctx).schema,
      data: {
        subscriber: data,
      },
    })

    await Subscriber.updateOrCreate({ id: validatedData.subscriber!.id }, validatedData.subscriber!)
  }
}
