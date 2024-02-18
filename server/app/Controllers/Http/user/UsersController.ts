import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserCreateValidator from 'App/Validators/user/UserCreateValidator'
import UserUpdateeValidator from 'App/Validators/user/UserUpdateValidator'
import User from 'App/Models/user/User'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
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

    user.merge(payload.user)
    await user.save()

    if (payload.address) {
      user.related('address').create(payload.address)
    }

    if (payload.social) {
      await user.related('social').create(payload.social)
    }

    if (payload.image) {
      user.avatar = await ResponsiveAttachment.fromFile(payload.image)
    }

    if (payload.favoriteLinks) {
      await user.related('favoriteLinks').createMany(payload.favoriteLinks)
    }

    if (payload.workExperience) {
      await user.related('experiences').createMany(payload.workExperience)
    }

    if (payload.education) {
      await user.related('educations').createMany(payload.education)
    }

    if (payload.languages) {
      await user.related('languages').attach(payload.languages)
    }

    if (payload.skills) {
      await user.related('skills').createMany(payload.skills)
    }

    if (payload.NotificationSettings) {
      await user.related('NotificationSetting').create(payload.NotificationSettings)
    }

    await user.save()

    return response.custom({
      message: 'User Added Successfully',
      code: 201,
      data: user,
      status: true,
      alertType: 'success'
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(UserUpdateeValidator)
    const id = params.id
    const user = await User.findOrFail(id)
    await bouncer.with('userPolicy').authorize('update', user)

    if (payload.user) {
      user.merge(payload.user)
      await user.save()
    }

    if (payload.address) {
      await user?.load('address')

      if (user?.address) {
        await user.address.delete()
        await user.related('address').create(payload.address)
      } else {
        await user.related('address').create(payload.address)
      }
    }

    if (payload.social) {
      await user?.load('social')
      if (user?.social) {
        await user.social.delete()
        await user.related('social').create(payload.social)
      } else {
        await user.related('social').create(payload.social)
      }
    }

    if (payload.favoriteLinks) {
      await user?.load('favoriteLinks')

      if (user?.favoriteLinks) {
        user.favoriteLinks.forEach((l) => {
          l.delete()
        })
      }

      user && (await user.related('favoriteLinks').createMany(payload.favoriteLinks))
    }

    if (payload.workExperience) {
      await user?.load('experiences')

      if (user?.experiences) {
        user.experiences.forEach((l) => {
          l.delete()
        })
      }
      user && (await user.related('experiences').createMany(payload.workExperience))
    }

    if (payload.image) {
      user.avatar = await ResponsiveAttachment.fromFile(payload.image)
    }

    if (payload.languages) {
      await user?.load('languages')
      if (user?.languages) {
        user.related('languages').detach()
        user && (await user.related('languages').attach(payload.languages))
      } else {
        user && (await user.related('languages').attach(payload.languages))
      }
    }

    if (payload.skills) {
      await user?.load('skills')
      if (user?.skills) {
        await user.related('skills').detach()
        user && (await user.related('skills').createMany(payload.skills))
      } else {
        user && (await user.related('skills').createMany(payload.skills))
      }
    }

    if (payload.NotificationSettings) {
      await user?.load('NotificationSetting')
      if (user?.NotificationSetting) {
        user.NotificationSetting.delete()
        user && (await user.related('NotificationSetting').create(payload.NotificationSettings))
      } else {
        user && (await user.related('NotificationSetting').create(payload.NotificationSettings))
      }
    }

    user && (await user.save())

    return response.custom({
      message: 'User updated Successfully',
      code: 201,
      data: user,
      status: true,
      alertType: 'success'
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
      status: true,
      alertType: 'success'
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
      status: true,
      alertType: 'success'
    })
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new UserUpdateeValidator(ctx).schema,
      data: {
        user: data,
      },
    })

    await User.updateOrCreate({ id: validatedData.user!.id }, validatedData.user!)
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, avatar, ...rest } = record
    return { ...rest, password: '' }
  }
}
