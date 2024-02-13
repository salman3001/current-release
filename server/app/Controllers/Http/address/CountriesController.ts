import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Country from 'App/Models/address/Country'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class CountriesController extends BaseController {
  constructor() {
    super(Country, {}, {}, 'LocationPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('create')
    const countrySchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
      continentId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: countrySchema })
    const record = await Country.create(payload)
    return response.json({ message: 'record created', data: record })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('update')
    const country = await Country.findOrFail(+params.id)
    const countrySchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
      continentId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: countrySchema })
    country.merge(payload)
    await country.save()
    return response.json({ message: 'record updated', data: country })
  }

  public async storeExcelData(data: any): Promise<void> {
    const validatedData = await validator.validate({
      schema: schema.create({
        id: schema.number(),
        name: schema.string({ trim: true }),
        isActive: schema.boolean.optional(),
        continentId: schema.number.optional(),
      }),
      data,
    })
    await Country.updateOrCreate({ id: validatedData.id }, validatedData)
  }
}
