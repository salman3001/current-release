import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VendorProfileUpdateValidator {
  constructor(protected ctx: HttpContextContract) { }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    avatar: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    logo: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    cover: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    video: schema.file.optional({
      extnames: ['mp4'],
      size: '25mb',
    }),
    brocher: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    images: schema.array.optional().members(
      schema.file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
    ),
    profile: schema.object().members({
      shortDesc: schema.string.optional(),
      longDesc: schema.string.optional(),
      isActive: schema.boolean.optional(),
    }),
    seo: schema.object.optional().members({
      metaTitle: schema.string.optional(),
      metaKeywords: schema.string.optional(),
      metaDesc: schema.string.optional(),
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

    faq: schema.array.optional().members(
      schema.object().members({
        quest: schema.string(),
        ans: schema.string(),
      })
    ),
    address: schema.array.optional().members(
      schema.object().members({
        address: schema.string({ trim: true }),
        geoLocation: schema.string(),
      })
    ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
