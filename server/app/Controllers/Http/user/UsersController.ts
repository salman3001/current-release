import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserCreateValidator from 'App/Validators/user/UserCreateValidator'
import UserUpdateeValidator from 'App/Validators/user/UserUpdateValidator'
import User from 'App/Models/user/User'
import BaseController from '../BaseController'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'

export default class UsersController extends BaseController {
  constructor() {
    super(User, UserCreateValidator, UserUpdateeValidator, 'userPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const payload = await request.validate(UserCreateValidator)
    const user = new User()
    await bouncer.with('userPolicy').authorize('create')

    user.merge(payload)
    await user.save()

    await user.save()

    return response.custom({
      message: 'User Added Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(UserUpdateeValidator)
    const id = params.id
    const user = await User.findOrFail(id)
    await bouncer.with('userPolicy').authorize('update', user)

    user.merge(payload)
    await user.save()

    return response.custom({
      message: 'User updated Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async banUser({ params, response, bouncer }: HttpContextContract) {
    await bouncer.with('userPolicy').authorize('delete')
    const user = await User.findOrFail(+params.id)
    user.isActive = false
    await user.save()
    return response.custom({
      message: 'User Banned Successfully',
      code: 200,
      data: user,
      success: true,
    })
  }

  public async updateUserPassword({ params, response, request, bouncer }: HttpContextContract) {
    const user = await User.findOrFail(+params.id)

    await bouncer.with('userPolicy').authorize('update', user)

    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    user.password = payload.password
    await user.save()
    return response.custom({
      message: 'Password changed',
      code: 200,
      data: user,
      success: true,
    })
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new UserUpdateeValidator(ctx).schema,
      data: {
        user: data,
      },
    })

    await User.updateOrCreate({ id: validatedData.id }, validatedData)
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, avatar, ...rest } = record
    return { ...rest, password: '' }
  }
}
