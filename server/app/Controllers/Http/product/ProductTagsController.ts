import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductTag from 'App/Models/product/ProductTag'
import CategoryCreateValidator from 'App/Validators/product/CategoryCreateValidator'
import CategoryUpdateValidator from 'App/Validators/product/CategoryUpdateValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class ProductTagsController extends BaseController {
  constructor() {
    super(ProductTag, CategoryCreateValidator, CategoryUpdateValidator, 'ProductPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ProductPolicy').authorize('create')

    const payload = await request.validate(CategoryCreateValidator)
    const tag = await ProductTag.create(payload.category)

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

    return response.json({ message: 'record created', data: tag })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ProductPolicy').authorize('update')

    const payload = await request.validate(CategoryUpdateValidator)
    const tag = await ProductTag.findOrFail(+params.id)

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

    return response.json({ message: 'record created', data: tag })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, thumbnail, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CategoryUpdateValidator(ctx).schema,
      data: {
        category: data,
      },
    })

    await ProductTag.updateOrCreate({ id: validatedData.category!.id }, validatedData.category!)
  }
}
