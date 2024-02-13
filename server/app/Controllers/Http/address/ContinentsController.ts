import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import BaseController from '../BaseController'
import Continent from 'App/Models/address/Continent'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class ContinentsController extends BaseController {
  constructor() {
    super(Continent, {}, {}, 'LocationPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('create')
    const continentSchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
    })
    const payload = await request.validate({ schema: continentSchema })
    const record = await Continent.create(payload)
    return response.json({ message: 'record created', data: record })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('update')
    const continent = await Continent.findOrFail(+params.id)
    const continentSchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
    })
    const payload = await request.validate({ schema: continentSchema })
    continent.merge(payload)
    await continent.save()
    return response.json({ message: 'record updated', data: continent })
  }

  public async storeExcelData(data: any): Promise<void> {
    const validatedData = await validator.validate({
      schema: schema.create({
        id: schema.number(),
        name: schema.string({ trim: true }),
        isActive: schema.boolean.optional(),
      }),
      data,
    })
    await Continent.updateOrCreate({ id: validatedData.id }, validatedData)
  }
}
