import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactMessage from 'App/Models/helpcenter/ContactMessage'
import BaseController from '../BaseController'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ContactMessagesController extends BaseController {
  constructor() {
    super(ContactMessage, {}, {}, 'ContactMessagePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('create')
    const validationSchema = schema.create({
      name: schema.string(),
      title: schema.string(),
      email: schema.string({ escape: true }, [
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      message: schema.string([rules.minLength(10)]),
    })

    const payload = await request.validate({ schema: validationSchema })
    const record = await ContactMessage.create(payload)
    return response.custom({
      message: 'Contact Message Created',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('update')
    const message = await ContactMessage.findOrFail(+params.id)

    const payload = await request.validate({} as any)
    message.merge(payload)
    await message.save()
    return response.custom({
      message: 'Contact Message Updated',
      code: 201,
      data: message,
      success: true,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    return rest
  }
}
