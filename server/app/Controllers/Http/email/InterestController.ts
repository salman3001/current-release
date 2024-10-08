import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import Interest from 'App/Models/email/Interest'

export default class InterestController extends BaseController {
  constructor() {
    super(Interest, {}, {}, 'IntrestPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('IntrestPolicy').authorize('create')

    const payload = await request.validate({} as any)
    const record = await Interest.create(payload)
    return response.custom({
      message: 'Interest Created',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('IntrestPolicy').authorize('update')
    const interest = await Interest.findOrFail(+params.id)
    const payload = await request.validate({} as any)
    interest.merge(payload)
    await interest.save()
    return response.custom({
      message: 'Interest Updated',
      code: 201,
      data: interest,
      success: true,
    })
  }
}
