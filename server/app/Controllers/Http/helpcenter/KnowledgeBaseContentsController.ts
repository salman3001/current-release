import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpcenterContentValidator from 'App/Validators/helpcenter/HelpcenterContentValidator'
import slugify from 'slugify'
import BaseController from '../BaseController'
import KnowledgeBaseContent from 'App/Models/helpcenter/KnowledgeBaseContent'
import HelpcenterContentUpdateValidator from 'App/Validators/helpcenter/HelpcenterContentUpdateValidator'

export default class KnowledgeBaseContentsController extends BaseController {
  constructor() {
    super(
      KnowledgeBaseContent,
      HelpcenterContentValidator,
      HelpcenterContentUpdateValidator,
      'KnowledgebasePolicy'
    )
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('create')

    const payload = await request.validate(HelpcenterContentValidator)
    const { slug, ...restPayload } = payload

    let record: any = null

    if (slug) {
      record = await KnowledgeBaseContent.create(payload)
    } else {
      record = await KnowledgeBaseContent.create({
        ...restPayload,
        slug: slugify(payload.title),
      })
    }
    return response.custom({
      message: 'Content Created',
      code: 201,
      data: record,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('update')
    const content = await KnowledgeBaseContent.findOrFail(+params.id)
    const payload = await request.validate(HelpcenterContentUpdateValidator)
    const { slug, ...restPayload } = payload

    if (slug) {
      content.merge(payload)
      await content.save()
    } else {
      content.merge({
        ...restPayload,
        slug: slugify(payload.title),
      })
      await content.save()
    }
    return response.custom({
      message: 'Content Updated',
      code: 201,
      data: content,
      success: true,
    })
  }
}
