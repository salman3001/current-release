import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactMessage from 'App/Models/helpcenter/ContactMessage'
import BaseController from '../BaseController'

export default class ContactMessagesController extends BaseController {
  constructor() {
    super(ContactMessage, {}, {}, 'ContactMessagePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ContactMessagePolicy').authorize('create')

    const payload = await request.validate({} as any)
    const record = await ContactMessage.create(payload)
    return response.custom({
      message: 'Contact Message Created',
      code: 201,
      data: record,
      status: true,
      alertType: 'success'
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
      status: true,
      alertType: 'success'
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, ...rest } = record
    return rest
  }
}
