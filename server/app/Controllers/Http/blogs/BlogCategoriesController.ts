import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BlogCategoryValidator from 'App/Validators/blogs/BlogCategoryValidator'
import slugify from 'slugify'
import BlogCategory from 'App/Models/blogs/BlogCategory'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'
import BlogCategoryUpdateValidator from 'App/Validators/blogs/BlogCategoryUpdateValidator'

export default class BlogCategoriesController extends BaseController {
  constructor() {
    super(BlogCategory, BlogCategoryValidator, BlogCategoryUpdateValidator, 'BlogPolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('BlogPolicy').authorize('create')
    const { slug, ...payload } = await request.validate(BlogCategoryValidator)

    let category: BlogCategory | null = null

    if (slug) {
      category = await BlogCategory.create({ ...payload, slug })
    } else {
      category = await BlogCategory.create({ slug: slugify(payload.name), ...payload })
    }

    return response.custom({
      message: 'Blog category Created!',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('BlogPolicy').authorize('update')
    const { slug, ...payload } = await request.validate(this.updateValidator)
    const category = await BlogCategory.findOrFail(+params.id)

    if (slug) {
      category.merge({ ...payload, slug })
    } else {
      category.merge({ slug: slugify(payload.name), ...payload })
    }
    await category.save()

    return response.custom({
      message: 'Blog category updated!',
      code: 201,
      data: category,
      success: true,
    })
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    ctx.meta = {
      currentObjectId: data.id,
    }
    const validatedData = await validator.validate({
      schema: new BlogCategoryUpdateValidator(ctx).schema,
      data,
    })
    await BlogCategory.updateOrCreate(
      { id: validatedData.id },
      {
        ...validatedData,
        slug: validatedData.slug ? slugify(validatedData.slug) : slugify(validatedData.name),
      }
    )
  }
}
