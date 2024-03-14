import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ServiceCategory from 'App/Models/service/ServiceCategory'
import CategoryCreateValidator from 'App/Validators/service/CategoryCreateValidator'
import CategoryUpdateValidator from 'App/Validators/service/CategoryUpdateValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class ServiceCategoriesController extends BaseController {
  constructor() {
    super(
      ServiceCategory,
      CategoryCreateValidator,
      CategoryUpdateValidator,
      'ServiceCategoryPolicy'
    )
  }

  public async showBySlug({ request, response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('view')

    const slug = params.slug
    const serviceCategoryQuery = ServiceCategory.query().where('slug', slug)

    this.showfilterQuery(request.qs() as any, serviceCategoryQuery)

    const category = await serviceCategoryQuery.first()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: category,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('create')
    const payload = await request.validate(CategoryCreateValidator)
    const category = await ServiceCategory.create(payload.category)

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
    return response.custom({
      message: 'Category Added',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('ServiceCategoryPolicy').authorize('update')

    const payload = await request.validate(CategoryUpdateValidator)
    const category = await ServiceCategory.findOrFail(+params.id)

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

    return response.custom({
      message: 'Category Updated',
      code: 201,
      data: category,
      success: true,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { createdAt, updatedAt, thumbnail, subCategoryCount, ...rest } = record
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

    await ServiceCategory.updateOrCreate(
      { id: validatedData.category!.id },
      validatedData.category!
    )
  }
}
