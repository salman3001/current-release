import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminUser from 'App/Models/adminUser/AdminUser'
import AdminUserValidator from 'App/Validators/adminUser/AdminUserValidator'
import AdminUserUpdateValidator from 'App/Validators/adminUser/AdminUserUpdateValidator'
import Role from 'App/Models/adminUser/Role'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import BaseController from '../BaseController'
import Address from 'App/Models/address/Address'
import Social from 'App/Models/Social'
import { LucidRow } from '@ioc:Adonis/Lucid/Orm'

export default class AdminUsersController extends BaseController {
  constructor() {
    super(AdminUser, {}, AdminUserUpdateValidator, 'AdminUserPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('AdminUserPolicy').authorize('create')
    const payload = await request.validate(AdminUserValidator)
    const user = await AdminUser.create(payload.user)

    if (payload.address) {
      const address = await Address.create({
        address: payload?.address?.address || '',
        continentId: payload?.address?.continentId
          ? Number(payload?.address?.continentId)
          : undefined,
        countryId: payload?.address?.countryId ? Number(payload?.address?.countryId) : undefined,
        stateId: payload?.address?.stateId ? Number(payload?.address?.stateId) : undefined,
        cityId: payload?.address?.cityId ? Number(payload?.address?.cityId) : undefined,
        streetId: payload?.address?.streetId ? Number(payload?.address?.streetId) : undefined,
        zip: payload?.address?.zip,
      })

      user.related('address').save(address)
    }

    if (payload.social) {
      const social = await Social.create(payload.social)
      user.related('social').save(social)
    }

    if (payload.image) {
      user.avatar = await ResponsiveAttachment.fromFile(payload.image)
    }

    await user.save()

    return response.custom({
      message: 'User Created!',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    let user = await AdminUser.findOrFail(+params.id)
    await bouncer.with('AdminUserPolicy').authorize('update', user as AdminUser)
    const payload = await request.validate(AdminUserUpdateValidator)
    user.merge(payload.user)
    await user.save()

    await user.related('notifications').create({
      data: { message: 'behnchod' },
    })

    if (payload.address) {
      await user.load('address')
      if (user.address) {
        await user.address.delete()
        await user.related('address').create(payload.address)
      } else {
        await user.related('address').create(payload.address)
      }
    }
    if (payload.social) {
      await user.load('social')

      if (user.social) {
        await user.social.delete()
        const social = await Social.create(payload.social)
        await user.related('social').save(social)
      } else {
        const social = await Social.create(payload.social)
        await user.related('social').save(social)
      }
    }
    if (payload.user.roleId) {
      user.roleId = +payload.user.roleId
    }

    if (payload.image) {
      user.avatar = await ResponsiveAttachment.fromFile(payload.image)
    }

    await user?.save()

    return response.custom({
      message: 'User Updated!',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async banUser({ params, response, bouncer }: HttpContextContract) {
    const user = await AdminUser.findOrFail(+params.id)
    await bouncer.with('AdminUserPolicy').authorize('delete')
    if (user) {
      user.isActive = false
      await user.save()
      return response.custom({
        message: 'User banned!',
        code: 200,
        data: user,
        success: true,
      })
    } else {
      return response.custom({
        message: 'User Not found!',
        code: 400,
        data: user,
        success: false,
      })
    }
  }

  public async changeRole({ params, response, request, bouncer }: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize('update')
    const roleId = request.input('roleId')
    const role = await Role.find(+roleId)

    const user = await AdminUser.find(+params.id)
    await user?.related('role').dissociate()
    if (role) await user?.related('role').associate(role)

    return response.custom({
      message: 'Role Updated!',
      code: 201,
      data: null,
      success: true,
    })
  }

  public async updateUserPassword({ params, response, request, bouncer }: HttpContextContract) {
    const user = await AdminUser.findOrFail(+params.id)

    await bouncer.with('AdminUserPolicy').authorize('updatePassword', user)

    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
    })

    const payload = await request.validate({
      schema: validationSchema,
    })
    // const newPassword = await Hash.make(payload.password)
    user.password = payload.password
    await user.save()
    return response.custom({
      message: 'Password changed',
      code: 201,
      data: null,
      success: true,
    })
  }

  public async getExportRecords(): Promise<LucidRow[]> {
    const records = await AdminUser.query()
      .select(
        'id',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'desc',
        'is_active',
        'role_id'
      )
      .preload('address', (a) => {
        a.select('address', 'continent_id', 'country_id', 'state_id', 'city_id', 'street_id', 'zip')
      })
      .preload('social', (s) => {
        s.select('vk', 'website', 'facebook', 'twitter', 'instagram', 'linkedin')
      })
      .exec()

    return records
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const { address, social, ...rest } = data

    ctx.meta = {
      currentObjectId: data.id,
    }

    const validatedData = await validator.validate({
      schema: new AdminUserUpdateValidator(ctx).schema,
      data: {
        user: rest,
        address,
        social,
      },
    })

    const user = await AdminUser.updateOrCreate(
      { email: validatedData.user.email },
      validatedData.user
    )
    if (validatedData.address) {
      await user.load('address')
      if (user.address) {
        user.address.merge(validatedData.address)
        await user.address.save()
      } else {
        await user.related('address').create(validatedData.address)
      }
    }

    if (validatedData.social) {
      await user.load('social')
      if (user.social) {
        user.social.merge(validatedData.social)
        await user.social.save()
      } else {
        await user.related('social').create(validatedData.social)
      }
    }
  }

  public excludeIncludeExportProperties(record: any) {
    const {
      'social.adminUserId': x,
      'address.adminUserId': y,
      'social': s,
      'address': a,
      ...rest
    } = record
    return { ...rest, password: '' }
  }
}
