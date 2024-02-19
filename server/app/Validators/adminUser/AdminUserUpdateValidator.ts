import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminUserUpdateValidator {
  public id: number | null = null
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    image: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    user: schema.object().members({
      id: schema.number.optional(),
      email: schema.string({ trim: true }, [
        rules.unique({
          table: 'admin_users',
          column: 'email',
          whereNot: { id: this.ctx.params?.id || this.ctx?.meta?.currentObjectId },
        }),
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      password: schema.string.optional({ trim: true }, [rules.minLength(8), rules.alphaNum()]),
      firstName: schema.string({ trim: true }),
      lastName: schema.string({ trim: true }),
      phone: schema.string.optional({ trim: true }, [rules.minLength(8)]),
      desc: schema.string.optional(),
      isActive: schema.boolean.optional(),
      roleId: schema.number.optional(),
    }),
    address: schema.object.optional().members({
      address: schema.string.optional({ trim: true }),
      continentId: schema.number.optional(),
      countryId: schema.number.optional(),
      stateId: schema.number.optional(),
      cityId: schema.number.optional(),
      streetId: schema.number.optional(),
      zip: schema.string.optional({ trim: true }),
    }),
    social: schema.object.optional().members({
      website: schema.string.optional({ trim: true }),
      facebook: schema.string.optional({ trim: true }),
      twitter: schema.string.optional({ trim: true }),
      instagram: schema.string.optional({ trim: true }),
      pintrest: schema.string.optional({ trim: true }),
      linkedin: schema.string.optional({ trim: true }),
      vk: schema.string.optional({ trim: true }),
      whatsapp: schema.string.optional({ trim: true }),
      telegram: schema.string.optional({ trim: true }),
    }),
  })
}
