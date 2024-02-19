import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
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
      name: schema.string({ trim: true }, [
        rules.unique({
          table: 'cities',
          column: 'name',
        }),
      ]),
      isActive: schema.boolean.optional(),
      stateId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: citySchema })
    const record = await City.create(payload)
    return response.custom({
      message: 'City created!',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('update')
    const city = await City.findOrFail(+params.id)
    const citySchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.unique({
          table: 'cities',
          column: 'name',
          whereNot: { id: +params.id },
        }),
      ]),
      isActive: schema.boolean.optional(),
      stateId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: citySchema })
    city.merge(payload)
    await city.save()
    return response.custom({
      message: 'City updated!',
      code: 201,
      data: city,
      success: true,
    })
  }

  public async storeExcelData(data: any): Promise<void> {
    const validatedData = await validator.validate({
      schema: schema.create({
        id: schema.number(),
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'cities',
            column: 'name',
            whereNot: {
              id: data.id,
            },
          }),
        ]),
        isActive: schema.boolean.optional(),
        stateId: schema.number.optional(),
      }),
      data,
    })
    await City.updateOrCreate({ id: validatedData.id }, validatedData)
  }
}
