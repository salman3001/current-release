import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import State from 'App/Models/address/State'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class StatesController extends BaseController {
  constructor() {
    super(State, {}, {}, 'LocationPolicy')
  }
  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('create')
    const StateSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.unique({
          table: 'states',
          column: 'name',
        }),
      ]),
      isActive: schema.boolean.optional(),
      countryId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: StateSchema })
    const record = await State.create(payload)
    return response.custom({
      message: 'State Created!',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('LocationPolicy').authorize('update')
    const state = await State.findOrFail(+params.id)
    const StateSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.unique({
          table: 'states',
          column: 'name',
          whereNot: { id: +params.id },
        }),
      ]),
      isActive: schema.boolean.optional(),
      countryId: schema.number.optional(),
    })
    const payload = await request.validate({ schema: StateSchema })
    state.merge(payload)
    await state.save()
    return response.custom({
      message: 'State Created!',
      code: 201,
      data: state,
      success: true,
    })
  }

  public async storeExcelData(data: any): Promise<void> {
    const validatedData = await validator.validate({
      schema: schema.create({
        id: schema.number(),
        name: schema.string({ trim: true }, [
          rules.unique({
            table: 'states',
            column: 'name',
            whereNot: {
              id: data.id,
            },
          }),
        ]),
        isActive: schema.boolean.optional(),
        countryId: schema.number.optional(),
      }),
      data,
    })
    await State.updateOrCreate({ id: validatedData.id }, validatedData)
  }
}
