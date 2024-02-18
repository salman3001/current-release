import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import KnowledgeBaseCategory from 'App/Models/helpcenter/KnowledgeBaseCategory'
import HelpcenterContentCategoryValidator from 'App/Validators/helpcenter/HelpcenterContentCategoryValidator'
import slugify from 'slugify'
import BaseController from '../BaseController'

export default class KnowledgeBaseCategoriesController extends BaseController {
  constructor() {
    super(
      KnowledgeBaseCategory,
      HelpcenterContentCategoryValidator,
      HelpcenterContentCategoryValidator,
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
        status: true,
        alertType: 'success'
      })
    } catch (error) {
      return response.custom({
        message: 'Failed to create Category Created',
        code: 400,
        data: record,
        status: false,
        alertType: 'error'
      })
    }
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('update')
    const category = await KnowledgeBaseCategory.findOrFail(+params.id)

    const payload = await request.validate(HelpcenterContentCategoryValidator)
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
      status: true,
      alertType: 'success'
    })
  }
}
