import { ResponsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Template from 'App/Models/email/Template'
import CreateTemplateValidator from 'App/Validators/news-letter/CreateTemplateValidator'
import BaseController from '../BaseController'
import { validator } from '@ioc:Adonis/Core/Validator'

export default class TemplatesController extends BaseController {
  constructor() {
    super(Template, CreateTemplateValidator, CreateTemplateValidator, 'TemplatePolicy')
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('TemplatePolicy').authorize('create')

    const payload = await request.validate(CreateTemplateValidator)
    const template = await Template.create(payload.template)

    if (payload.thumbnail) {
      template.thumbnail = await ResponsiveAttachment.fromFile(payload.thumbnail)
    }

    await template.save()
    return response.custom({
      message: 'Template Created',
      code: 201,
      data: template,
      success: true,
    })
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.with('TemplatePolicy').authorize('update')

    const template = await Template.findOrFail(+params.id)
    const payload = await request.validate(CreateTemplateValidator)
    template.merge(payload.template)

    await template.save()

    if (payload.thumbnail) {
      template.thumbnail = await ResponsiveAttachment.fromFile(payload.thumbnail)
    }
    await template.save()
    return response.custom({
      message: 'Template Updated',
      code: 201,
      data: template,
      success: true,
    })
  }

  public excludeIncludeExportProperties(record: any) {
    const { thumbnail, ...rest } = record
    return rest
  }

  public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
    const validatedData = await validator.validate({
      schema: new CreateTemplateValidator(ctx).schema,
      data: {
        template: data,
      },
    })

    await Template.updateOrCreate({ id: validatedData.template!.id }, validatedData.template!)
  }
}
