import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Service from 'App/Models/service/Service'
import ServiceCreateValidator from 'App/Validators/service/ServiceCreateValidator'
import ServiceUpdateValidator from 'App/Validators/service/ServiceUpdateValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Config from '@ioc:Adonis/Core/Config'

export default class ServiceController {

  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('viewList')
    const serviceQuery = Service.query().preload('serviceCategory', s => {
      s.select(['name'])
    }).preload('images').preload('variants', v => {
      v.select(['name'])
    }).select(['id', 'name', 'slug', "short_desc", "is_active", "geo_location", "avg_rating", "vendor_user_id", "service_category_id", "service_subcategory_id"])

    this.applyFilters(serviceQuery, request.qs())

    serviceQuery.withCount('reviews', r => {
      r.as('reviews_count')
    })

    serviceQuery.withAggregate('variants', v => {
      v.min('price').as('starting_from')
    })



    const services = await serviceQuery.paginate(request.qs().page || 1, request.qs().perPage || Config.get('common.rowsPerPage'))

    return response.custom({
      code: 200,
      data: services,
      success: true,
      message: null
    })
  }

  public async showBySlug({ request, response, bouncer, params }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('view')

    const slug = params.slug
    const serviceQuery = Service.query().where('slug', slug).preload('variants').preload('vendorUser', v => {
      v.withCount('reviews')
    }).preload('reviews', r => {
      r.limit(10)
    })

    this.applyFilters(serviceQuery, request.qs() as any,)

    const service = await serviceQuery.first()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: service,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('create')

    const payload = await request.validate(ServiceCreateValidator)

    let service: Service | null = null

    await Database.transaction(async (trx) => {
      service = await Service.create(payload.service, { client: trx })

      if (payload.seo) {
        await service.related('seo').create(payload.seo)
      }

      if (payload.tags) {
        await service.related('tags').attach(payload.tags)
      }

      if (payload.faq) {
        await service.related('faq').createMany(payload.faq)
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

        await service.related('images').saveMany(validImages as Image[])
      }

      // if (payload.video) {
      //   service.video = Attachment.fromFile(payload.video)
      // }

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
    const payload = await request.validate(ServiceUpdateValidator)

    let service: Service | null = null

    await Database.transaction(async (trx) => {
      service = await Service.findOrFail(+params.id, { client: trx })
      await bouncer.with('ServicePolicy').authorize('update', service)

      if (payload.service) {
        service.merge(payload.service)
        await service.save()
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

      if (payload.faq) {
        await service.load('faq')
        if (service.faq) {
          for (const f of service.faq) {
            await f.delete()
          }
        }
        await service.related('faq').createMany(payload.faq)
      }

      if (payload.images) {
        await service.load('images')

        await Promise.all(
          service.images.map(async (s) => {
            await s.delete()
          })
        )

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
        await service.related('images').saveMany(validImages as Image[])
      }

      // if (payload.video) {
      //   if (service.video) {

      //   service.video = Attachment.fromFile(payload.video)
      // }

      await service.save()
    })

    if (service) {
      await (service as Service).refresh()
    }

    return response.custom({
      message: 'Service Updated',
      code: 201,
      data: service,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const service = await Service.findOrFail(+params.id)
    await bouncer.with('ServicePolicy').authorize('delete', service)
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

  private applyFilters(modelQuery: ModelQueryBuilderContract<typeof Service, Service>, qs: Record<string, any>) {
    if (qs?.search) {
      modelQuery.whereILike('name', qs?.search)
    }

    if (qs?.where?.category_id) {
      modelQuery.whereHas('serviceCategory', b => {
        b.where('id', qs?.where?.category_id)
      })
    }

    if (qs?.orderBy) {
      const [orderBy, direction] = (qs.orderBy as string).split(':')
      modelQuery.orderBy(orderBy, (direction as 'desc') || 'asc')
    }
  }

  // public excludeIncludeExportProperties(record: any) {
  //   const { createdAt, updatedAt, logo, cover, brocher, ...rest } = record
  //   return rest
  // }

  // public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
  //   ctx.meta = {
  //     currentObjectId: data.id,
  //   }
  //   const validatedData = await validator.validate({
  //     schema: new ServiceUpdateValidator(ctx).schema,
  //     data: {
  //       service: data,
  //     },
  //   })

  //   await Service.updateOrCreate({ id: validatedData.service!.id }, validatedData.service!)
  // }
}
