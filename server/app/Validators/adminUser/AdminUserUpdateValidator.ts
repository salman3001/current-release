import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminUserUpdateValidator {
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
    image: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],
      size: '5mb',
    }),
    user: schema.object().members({
      id: schema.number.optional(),
      email: schema.string({ trim: true }, [
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
}
