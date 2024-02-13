import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HelpcenterContentValidator from 'App/Validators/helpcenter/HelpcenterContentValidator'
import slugify from 'slugify'
import BaseController from '../BaseController'
import KnowledgeBaseContent from 'App/Models/helpcenter/KnowledgeBaseContent'

export default class KnowledgeBaseContentsController extends BaseController {
  constructor() {
    super(
      KnowledgeBaseContent,
      HelpcenterContentValidator,
      HelpcenterContentValidator,
      'KnowledgebasePolicy'
    )
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('create')

    const payload = await request.validate(HelpcenterContentValidator)
    const { slug, ...restPayload } = payload

    let record: any = null
    try {
      if (slug) {
        record = await KnowledgeBaseContent.create(payload)
      } else {
        record = await KnowledgeBaseContent.create({
          ...restPayload,
          slug: slugify(payload.title),
        })
      }
      return response.json({ message: 'record created', data: record })
    } catch (error) {
      console.log(error)
      return response.abort({ message: 'Something went wrong' })
    }
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('KnowledgebasePolicy').authorize('update')
    const content = await KnowledgeBaseContent.findOrFail(+params.id)
    const payload = await request.validate(HelpcenterContentValidator)
    const { slug, ...restPayload } = payload

    try {
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
      return response.json({ message: 'record updated', data: content })
    } catch (error) {
      console.log(error)
      return response.abort({ message: 'Something went wrong' })
    }
  }
}
