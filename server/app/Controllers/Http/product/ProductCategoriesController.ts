import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProductCategory from 'App/Models/product/ProductCategory'
import CategoryCreateValidator from 'App/Validators/product/CategoryCreateValidator'
import CategoryUpdateValidator from 'App/Validators/product/CategoryUpdateValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class ProductCategoriesController extends BaseController {
  constructor() {
    super(ProductCategory, CategoryCreateValidator, CategoryUpdateValidator, 'ProductPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ProductPolicy').authorize('create')
    const payload = await request.validate(CategoryCreateValidator)
    const category = await ProductCategory.create(payload.category)

    if (payload.seo) {
      await category.related('seo').create(payload.seo)
    }

    if (payload.faq) {
      await category.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      category.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }

    await category.save()
    return response.json({ message: 'record created', data: category })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ProductPolicy').authorize('update')

    const payload = await request.validate(CategoryUpdateValidator)
    const category = await ProductCategory.findOrFail(+params.id)

    if (payload.category) {
      category.merge(payload.category)
      await category.save()
    }

    if (payload.seo) {
      await category.load('seo')
      if (category.seo) {
        category.seo.merge(payload.seo)
        await category.seo.save()
      } else {
        await category.related('seo').create(payload.seo)
      }
    }

    if (payload.faq) {
      await category.load('faqs')
      if (category.faqs) {
        for (const f of category.faqs) {
          await f.delete()
        }
      }
      await category.related('faqs').createMany(payload.faq)
    }

    if (payload.image) {
      category.thumbnail = await ResponsiveAttachment.fromFile(payload.image)
    }
    await category.save()

    return response.json({ message: 'record created', data: category })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, thumbnail, subCategoryCount, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CategoryUpdateValidator(ctx).schema,
      data: {
        category: data,
      },
    })

    await ProductCategory.updateOrCreate(
      { id: validatedData.category!.id },
      validatedData.category!
    )
  }
}
