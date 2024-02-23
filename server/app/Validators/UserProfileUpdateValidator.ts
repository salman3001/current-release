import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserProfileUpdateValidator {
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
    image: schema.file.optional({
      extnames: ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'],

      size: '5mb',
    }),
    address: schema.array().members(
      schema.object.optional().members({
        address: schema.string({ trim: true }),
        geoLocation: schema.string()
      })
    ),
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
    favoriteLinks: schema.array.optional().members(
      schema.object().members({
        link: schema.string({ trim: true }),
      })
    ),
    workExperience: schema.array.optional().members(
      schema.object().members({
        jobIndustryId: schema.number.optional(),
        jobFunction: schema.string.optional({ trim: true }),
        jobTitle: schema.string.optional({ trim: true }),
        jobDepartmentId: schema.number.optional(),
        companyName: schema.string.optional({ trim: true }),
        companySize: schema.string.optional({ trim: true }),
        startDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
        endDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
        desc: schema.string.optional({ trim: true }),
        isCurrent: schema.boolean.optional(),
      })
    ),
    education: schema.array.optional().members(
      schema.object().members({
        institute: schema.string.optional({ trim: true }),
        degree: schema.string.optional({ trim: true }),
        field: schema.string.optional({ trim: true }),
        startDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
        endDate: schema.date.optional({ format: 'dd/MM/yyyy' }),
        desc: schema.string.optional({ trim: true }),
      })
    ),
    languages: schema.array.optional().members(schema.number()),
    skills: schema.array.optional().members(
      schema.object().members({
        name: schema.string({ trim: true }),
        desc: schema.string.optional({ trim: true }),
      })
    ),
    NotificationSettings: schema.object.optional().members({
      onMessageRecieve: schema.boolean.optional(),
      onCommentReply: schema.boolean.optional(),
      onServiceUpdate: schema.boolean.optional(),
      onOffers: schema.boolean.optional(),
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
  public messages: CustomMessages = {}
}
