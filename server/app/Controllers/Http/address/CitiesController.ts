import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import BaseController from '../BaseController'
import City from 'App/Models/address/City'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class CitiesController extends BaseController {
  constructor() {
    super(City, {}, {}, 'LocationPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('create')
    const citySchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
      stateId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: citySchema })
    const record = await City.create(payload)
    return response.json({ message: 'record created', data: record })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('update')
    const city = await City.findOrFail(+params.id)
    const citySchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
      stateId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: citySchema })
    city.merge(payload)
    await city.save()
    return response.json({ message: 'record updated', data: city })
  }

  public async storeExcelData(data: any): Promise<void> {
    const validatedData = await validator.validate({
      schema: schema.create({
        id: schema.number(),
        name: schema.string({ trim: true }),
        isActive: schema.boolean.optional(),
        stateId: schema.number.optional(),
      }),
      data,
    })
    await City.updateOrCreate({ id: validatedData.id }, validatedData)
  }
}
