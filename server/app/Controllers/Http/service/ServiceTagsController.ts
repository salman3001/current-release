import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceTag from 'App/Models/service/ServiceTag'
import CategoryCreateValidator from 'App/Validators/service/CategoryCreateValidator'
import CategoryUpdateValidator from 'App/Validators/service/CategoryUpdateValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class ServiceTagsController extends BaseController {
  constructor() {
    super(ServiceTag, CategoryCreateValidator, CategoryUpdateValidator, 'ServicePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('create')

    const payload = await request.validate(CategoryCreateValidator)
    const tag = await ServiceTag.create(payload.category)

    if (payload.seo) {
      await tag.related('seo').create(payload.seo)
    }

    if (payload.faq) {
      await tag.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      tag.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }
    await tag.save()

    return response.custom({
      message: 'Tag Added',
      code: 201,
      data: tag,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ServicePolicy').authorize('update')

    const payload = await request.validate(CategoryUpdateValidator)
    const tag = await ServiceTag.findOrFail(+params.id)

    if (payload.category) {
      tag.merge(payload.category)
      await tag.save()
    }

    if (payload.seo) {
      await tag.load('seo')
      if (tag.seo) {
        tag.seo.merge(payload.seo)
        await tag.seo.save()
      } else {
        await tag.related('seo').create(payload.seo)
      }
    }

    if (payload.faq) {
      await tag.load('faqs')
      if (tag.faqs) {
        for (const f of tag.faqs) {
          await f.delete()
        }
      }
      await tag.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      tag.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }
    await tag.save()

    return response.custom({
      message: 'Tag updated',
      code: 201,
      data: tag,
      success: true,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, thumbnail, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new CategoryUpdateValidator(ctx).schema,
      data: {
        category: data,
      },
    })

    await ServiceTag.updateOrCreate({ id: validatedData.category!.id }, validatedData.category!)
  }
}
