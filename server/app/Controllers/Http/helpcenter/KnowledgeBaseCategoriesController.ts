import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import KnowledgeBaseCategory from 'App/Models/helpcenter/KnowledgeBaseCategory'
import HelpcenterContentCategoryValidator from 'App/Validators/helpcenter/HelpcenterContentCategoryValidator'
import slugify from 'slugify'
import BaseController from '../BaseController'
import HelpcenterContentCategoryUpdateValidator from 'App/Validators/helpcenter/HelpcenterContentCategoryUpdateValidator'

export default class KnowledgeBaseCategoriesController extends BaseController {
  constructor() {
    super(
      KnowledgeBaseCategory,
      HelpcenterContentCategoryValidator,
      HelpcenterContentCategoryUpdateValidator,
      'KnowledgebasePolicy'
    )
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('create')

    const payload = await request.validate(HelpcenterContentCategoryValidator)
    const { slug, ...restPayload } = payload

    let record: any = null
    try {
      if (slug) {
        record = await KnowledgeBaseCategory.create(payload)
      } else {
        record = await KnowledgeBaseCategory.create({
          ...restPayload,
          slug: slugify(payload.name),
        })
      }
      return response.custom({
        message: 'Category Created',
        code: 201,
        data: record,
        success: true,
      })
    } catch (error) {
      return response.custom({
        message: 'Failed to create Category Created',
        code: 400,
        data: record,
        success: false,
      })
    }
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('update')
    const category = await KnowledgeBaseCategory.findOrFail(+params.id)

    const payload = await request.validate(HelpcenterContentCategoryUpdateValidator)
    const { slug, ...restPayload } = payload

    if (slug) {
      category.merge(payload)
      await category.save()
    } else {
      category.merge({
        ...restPayload,
        slug: slugify(payload.name),
      })
      await category.save()
    }

    return response.custom({
      message: 'Category updated',
      code: 201,
      data: category,
      success: true,
    })
  }
}
