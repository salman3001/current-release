import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Service from 'App/Models/service/Service'
import ServiceCreateValidator from 'App/Validators/service/ServiceCreateValidator'
import ServiceUpdateValidator from 'App/Validators/service/ServiceUpdateValidator'
import BaseController from '../BaseController'
import Video from 'App/Models/Video'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { validator } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ServiceController extends BaseController {
  constructor() {
    super(Service, ServiceCreateValidator, ServiceUpdateValidator, 'ServicePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('create')

    console.log(request.body())
    const payload = await request.validate(ServiceCreateValidator)

    let service: Service | null = null

    await Database.transaction(async (trx) => {
      service = await Service.create(payload.service)
      service.useTransaction(trx)

      for (const variant of payload.variants) {
        const { aditionalProperties, image, ...restVariant } = variant
        const createdVariant = await service.related('variants').create(restVariant)
        createdVariant.useTransaction(trx)
        if (aditionalProperties) {
          await createdVariant.related('aditionalProperties').createMany(aditionalProperties)
        }
        if (image) {
          createdVariant.image = await ResponsiveAttachment.fromFile(image)
        }

        await createdVariant.save()
      }

      if (payload.seo) {
        await service.related('seo').create(payload.seo)
      }

      if (payload.tags) {
        await service.related('tags').attach(payload.tags)
      }

      if (payload.social) {
        await service.related('social').create(payload.social)
      }

      if (payload.faq) {
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.logo) {
        service.logo = await ResponsiveAttachment.fromFile(payload.logo)
      }

      if (payload.cover) {
        service.cover = await ResponsiveAttachment.fromFile(payload.cover)
      }

      if (payload.brocher) {
        service.brocher = await ResponsiveAttachment.fromFile(payload.brocher)
      }

      if (payload.images) {
        const images = await Promise.all(
          payload.images.map(async (img) => {
            try {
              const storeImg = await Image.create(
                {
                  file: await ResponsiveAttachment.fromFile(img),
                },
                { client: trx }
              )
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

        await service.related('screenshots').saveMany(validImages as Image[])
      }

      if (payload.video) {
        const video = await Video.create(
          { file: Attachment.fromFile(payload.video) },
          { client: trx }
        )
        await service.related('video').save(video)
      }

      await service.save()
    })

    return response.custom({
      message: 'Service Added',
      code: 201,
      data: service,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('update')

    const payload = await request.validate(ServiceUpdateValidator)

    let service: Service | null = null

    await Database.transaction(async (trx) => {
      service = await Service.findOrFail(+params.id, { client: trx })

      if (payload.service) {
        service.merge(payload.service)
        await service.save()
      }

      for (const variant of payload.variants) {
        const { properties, image, ...restVariant } = variant

        await service.load('variants')

        if (service.variants) {
          for (const variant of service.variants) {
            for (const prop of variant.aditionalProperties) {
              await prop.delete()
            }
            await variant.delete()
          }
        }

        const createdVariant = await service.related('variants').create(restVariant)
        createdVariant.useTransaction(trx)

        if (properties) {
          await createdVariant.related('aditionalProperties').createMany(properties)
        }
        if (image) {
          createdVariant.image = await ResponsiveAttachment.fromFile(image)
        }

        await createdVariant.save()
      }

      if (payload.seo) {
        await service.load('seo')
        if (service.seo) {
          service.seo.merge(payload.seo)
          await service.seo.save()
        } else {
          await service.related('seo').create(payload.seo)
        }
      }

      if (payload.tags) {
        await service.related('tags').detach()
        await service.related('tags').attach(payload.tags)
      }

      if (payload.social) {
        await service.load('social')
        if (service.social) {
          service.social.merge(payload.social)
          await service.social.save()
        } else {
          await service.related('social').create(payload.social)
        }
      }

      if (payload.faq) {
        await service.load('faq')
        if (service.faq) {
          for (const f of service.faq) {
            await f.delete()
          }
        }
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.logo) {
        service.logo = await ResponsiveAttachment.fromFile(payload.logo)
      }

      if (payload.cover) {
        service.cover = await ResponsiveAttachment.fromFile(payload.cover)
      }

      if (payload.brocher) {
        service.brocher = await ResponsiveAttachment.fromFile(payload.brocher)
      }

      if (payload.images) {
        await service.load('screenshots')

        await Promise.all(
          service.screenshots.map(async (s) => {
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
        await service.related('screenshots').saveMany(validImages as Image[])
      }

      if (payload.video) {
        await service.load('video')

        if (service.video) {
          await service.video.delete()
        }

        const video = await Video.create({ file: Attachment.fromFile(payload.video) })
        await service.related('video').save(video)
      }

      await service.save()
    })

    return response.custom({
      message: 'Service Updated',
      code: 201,
      data: service,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('delete')

    const service = await Service.findOrFail(+params.id)
    await service.load('screenshots')
    await service.load('video')

    if (service.screenshots) {
      await Promise.all(
        service.screenshots.map(async (img) => {
          await img.delete()
        })
      )
    }

    if (service.video) {
      await service.video.delete()
    }

    await service.delete()

    return response.custom({
      message: 'Service Deleted',
      code: 200,
      data: service,
      success: true,
    })
  }

  public async deleteScreenShot({ params, response }: HttpContextContract) {
    const image = await Image.findOrFail(+params.id)
    await image.delete()
    return response.custom({
      message: 'Service screenshot deleted',
      code: 200,
      data: image,
      success: true,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, logo, cover, brocher, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new ServiceUpdateValidator(ctx).schema,
      data: {
        service: data,
      },
    })

    await Service.updateOrCreate({ id: validatedData.service!.id }, validatedData.service!)
  }
}
