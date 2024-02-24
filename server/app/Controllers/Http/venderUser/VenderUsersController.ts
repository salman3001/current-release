import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VenderUser from 'App/Models/venderUser/VenderUser'
import BaseController from '../BaseController'
import VendorUserUpdateValidator from 'App/Validators/vendorUser/VendorUserUpdateValidator'
import VendorUserCreateValidator from 'App/Validators/vendorUser/VendorUserCreateValidator'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import UserProfile from 'App/Models/UserProfile'
import UserProfileUpdateValidator from 'App/Validators/UserProfileUpdateValidator'
import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Database from '@ioc:Adonis/Lucid/Database'
import BusinesUpdateValidator from 'App/Validators/BusinesUpdateValidator'
import Image from 'App/Models/Image'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Business from 'App/Models/venderUser/Business'

export default class VenderUsersController extends BaseController {
  constructor() {
    super(VenderUser, VendorUserCreateValidator, VendorUserUpdateValidator, 'VendorUserPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const { bussinessName, ...payload } = await request.validate(VendorUserCreateValidator)

    await bouncer.with('VendorUserPolicy').authorize('create')

    let user: VenderUser | null = null

    await Database.transaction(async (trx) => {
      user = await VenderUser.create(payload, { client: trx })
      await user.related('business').create({ name: bussinessName })
    })

    return response.custom({
      message: 'User Added Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const payload = await request.validate(VendorUserUpdateValidator)
    const id = params.id
    const user = await VenderUser.findOrFail(id)
    await bouncer.with('VendorUserPolicy').authorize('update', user)

    user.merge(payload)
    await user.save()

    return response.custom({
      message: 'User updated Successfully',
      code: 201,
      data: user,
      success: true,
    })
  }

  public async updateProfile({ request, response, params, bouncer }: HttpContextContract) {
    const user = await VenderUser.findOrFail(+params.id)
    await bouncer.with('VendorUserPolicy').authorize('update', user)
    user.load('profile')
    const profile = await UserProfile.findByOrFail('user_id', user.id)

    const payload = await request.validate(UserProfileUpdateValidator)
    if (payload.address) {
      await profile.load('addresses')

      if (profile.addresses) {
        for (const address of profile.addresses) {
          await address.delete()
        }
        await profile.related('addresses').createMany(payload.address)
      } else {
        await profile.related('addresses').createMany(payload.address)
      }
    }

    if (payload.social) {
      await profile?.load('social')
      if (profile?.social) {
        await profile.social.delete()
        await profile.related('social').create(payload.social)
      } else {
        await profile.related('social').create(payload.social)
      }
    }

    if (payload.favoriteLinks) {
      await profile?.load('favoriteLinks')

      if (profile?.favoriteLinks) {
        profile.favoriteLinks.forEach((l) => {
          l.delete()
        })
      }

      await profile.related('favoriteLinks').createMany(payload.favoriteLinks)
    }

    if (payload.workExperience) {
      await profile?.load('experiences')

      if (profile?.experiences) {
        if (profile?.experiences) {
          for (const e of profile.experiences) {
            await e.delete()
          }
        }
      }
      await profile.related('experiences').createMany(payload.workExperience)
    }

    if (payload.education) {
      await profile?.load('educations')

      if (profile?.educations) {
        if (profile?.educations) {
          for (const e of profile.educations) {
            await e.delete()
          }
        }
      }
      await profile.related('educations').createMany(payload.education)
    }

    if (payload.image) {
      profile.avatar = await ResponsiveAttachment.fromFile(payload.image)
    }

    if (payload.languages) {
      await profile.load('languages')
      if (profile.languages) {
        profile.related('languages').detach()
        await profile.related('languages').attach(payload.languages)
      } else {
        await profile.related('languages').attach(payload.languages)
      }
    }

    if (payload.skills) {
      await profile?.load('skills')
      if (profile?.skills) {
        await profile.related('skills').detach()
        await profile.related('skills').createMany(payload.skills)
      } else {
        await profile.related('skills').createMany(payload.skills)
      }
    }

    if (payload.NotificationSettings) {
      profile.notificationSetting = payload.NotificationSettings
    }

    await user.save()

    return response.custom({
      message: 'User Profile Updated!',
      code: 201,
      data: profile,
      success: true,
    })
  }

  public async updateBusiness({ request, response, params, bouncer }: HttpContextContract) {
    const user = await VenderUser.findOrFail(+params.id)

    const payload = await request.validate(BusinesUpdateValidator)

    const business = await Business.findByOrFail('vender_user_id', user.id)

    if (!business) {
      return response.custom({
        code: 404,
        message: 'User business not found',
        data: null,
        success: false,
      })
    }
    await bouncer.with('BussinessPolicy').authorize('update', business)

    if (payload.address) {
      await business.load('addresses')

      if (business.addresses) {
        for (const address of business.addresses) {
          await address.delete()
        }
        await business.related('addresses').createMany(payload.address)
      } else {
        await business.related('addresses').createMany(payload.address)
      }
    }

    if (payload.social) {
      await business?.load('social')
      if (business?.social) {
        await business.social.delete()
        await business.related('social').create(payload.social)
      } else {
        await business.related('social').create(payload.social)
      }
    }

    if (payload.cover) {
      business.cover = await ResponsiveAttachment.fromFile(payload.cover)
    }

    if (payload.logo) {
      business.logo = await ResponsiveAttachment.fromFile(payload.logo)
    }

    if (payload.brocher) {
      business.brocher = await ResponsiveAttachment.fromFile(payload.brocher)
    }

    if (payload.images) {
      await business.load('images')

      await Promise.all(
        business.images.map(async (s) => {
          await s.delete()
        })
      )

      const images = await Promise.all(
        payload.images.map(async (img) => {
          try {
            const storeImg = await Image.create({
              file: await ResponsiveAttachment.fromFile(img),
            })
            return storeImg
          } catch (error) {
            console.error('Error storing image:', error)
            // Handle the error or decide whether to skip this image
            return null
          }
        })
      )

      // Filter out any null values (images that failed to store)
      const validImages = images.filter((img) => img !== null)
      await business.related('images').saveMany(validImages as Image[])
    }

    // if (payload.video) {
    //   if (business.video) {
    //     await business.video.delete()
    //   }

    //   business.video = Attachment.fromFile(payload.video)
    // }

    await business.save()

    return response.custom({
      message: 'Business profile Updated!',
      code: 201,
      data: business,
      success: true,
    })
  }

  public async banUser({ params, response, bouncer }: HttpContextContract) {
    await bouncer.with('VendorUserPolicy').authorize('delete')
    const user = await VenderUser.findOrFail(+params.id)
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
    const user = await VenderUser.findOrFail(+params.id)

    await bouncer.with('VendorUserPolicy').authorize('update', user)

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
      schema: new VendorUserUpdateValidator(ctx).schema,
      data: {
        user: data,
      },
    })

    await VenderUser.updateOrCreate({ id: validatedData.id }, validatedData)
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, avatar, ...rest } = record
    return { ...rest, password: '' }
  }
}
