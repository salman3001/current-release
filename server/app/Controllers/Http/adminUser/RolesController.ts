import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import BaseController from '../BaseController'
import Role from 'App/Models/adminUser/Role'
import { permissions } from 'App/Helpers/enums'

export default class RolesController extends BaseController {
  constructor() {
    super(Role, {}, {}, 'RolePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('create')

    const payloadSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.unique({
          table: 'roles',
          column: 'name',
        }),
      ]),
      isActive: schema.boolean.optional(),
    })

    const payload = await request.validate({ schema: payloadSchema })

    const record = await Role.create(payload)

    return response.custom({
      message: 'Role Created!',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('update')
    const role = await Role.findOrFail(+params.id)

    const permissions = request.input('permissions') || []

    const isActive = request.input('isActive')

    role.isActive = isActive
    role.permissions = permissions
    await role.save()

    return response.custom({
      message: 'Role Updated!',
      code: 201,
      data: role,
      success: true,
    })
  }

  public async allPermissions({ response, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('viewList')

    const permissionsArray: string[] = []

    for (const perm of Object.values(permissions)) {
      permissionsArray.push(perm)
    }

    return response.custom({
      message: null,
      code: 200,
      data: permissionsArray,
      success: true,
    })
  }
}
