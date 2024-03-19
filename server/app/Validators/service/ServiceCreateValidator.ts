import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServiceCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    video: schema.file.optional({
      extnames: ['mp4'],
      size: '25mb',
    }),
    images: schema.array.optional().members(
      schema.file({
        extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
        size: '5mb',
      })
    ),
    service: schema.object().members({
      name: schema.string({ trim: true }),
      slug: schema.string({ trim: true }, [
        rules.slug(),
        rules.unique({
          table: 'services',
          column: 'slug',
        }),
      ]),
      shortDesc: schema.string.optional(),
      longDesc: schema.string.optional(),
      isActive: schema.boolean.optional(),
      locationSpecific: schema.boolean.optional(),
      geoLocation: schema.string(),
      vendorUserId: schema.number(),
      serviceCategoryId: schema.number.optional(),
      serviceSubcategoryId: schema.number.optional(),
    }),
    seo: schema.object.optional().members({
      metaTitle: schema.string.optional(),
      metaKeywords: schema.string.optional(),
      metaDesc: schema.string.optional(),
    }),
    faq: schema.array.optional().members(
      schema.object().members({
        quest: schema.string(),
        ans: schema.string(),
      })
    ),
    tags: schema.array.optional().members(schema.number()),
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
