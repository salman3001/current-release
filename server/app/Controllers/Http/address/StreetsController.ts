import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import BaseController from '../BaseController'
import Street from 'App/Models/address/Street'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class StreetsController extends BaseController {
  constructor() {
    super(Street, {}, {}, 'LocationPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('create')
    const streetSchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
      cityId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: streetSchema })
    const record = await Street.create(payload)
    return response.json({ message: 'record created', data: record })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('update')
    const street = await Street.findOrFail(+params.id)
    const streetSchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
      cityId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: streetSchema })
    street.merge(payload)
    await street.save()
    return response.json({ message: 'record updated', data: street })
  }

  public async storeExcelData(data: any): Promise<void> {
    const validatedData = await validator.validate({
      schema: schema.create({
        id: schema.number(),
        name: schema.string({ trim: true }),
        isActive: schema.boolean.optional(),
        cityId: schema.number.optional(),
      }),
      data,
    })
    await Street.updateOrCreate({ id: validatedData.id }, validatedData)
  }
}
