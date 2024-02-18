import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import BaseController from '../BaseController'
import Role from 'App/Models/adminUser/Role'

export default class RolesController extends BaseController {
  constructor() {
    super(Role, {}, {}, 'RolePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('create')

    const payloadSchema = schema.create({
      name: schema.string({ trim: true }),
      isActive: schema.boolean.optional(),
    })

    const payload = await request.validate({ schema: payloadSchema })

    const record = await Role.create(payload)

    return response.custom({
      message: 'Role Created!',
      code: 201,
      data: record,
      status: true,
      alertType: 'success'
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('update')
    const role = await Role.findOrFail(+params.id)

    const permissions = request.input('permissionId')
      ? request.input('permissionId').map((p: string) => p)
      : []

    const isActive = request.input('isActive')

    role.isActive = isActive
    await role.related('permissions').detach()
    await role.related('permissions').attach([...permissions])
    await role.save()

    return response.custom({
      message: 'Role Updated!',
      code: 201,
      data: role,
      status: true,
      alertType: 'success'
    })
  }
}
