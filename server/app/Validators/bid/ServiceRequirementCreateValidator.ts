import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BudgetType } from 'App/Helpers/enums'

export default class ServiceRequirementCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

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
    title: schema.string({ escape: true }, [rules.maxLength(50)]),
    desc: schema.string.optional({ escape: true }, [rules.maxLength(1500)]),
    skillsRequired: schema.array.optional().members(schema.string()),
    budgetType: schema.enum(Object.values(BudgetType)),
    budget: schema.number([rules.minNumber(1)]),
    expiresAt: schema.date({ format: 'dd/MM/yyyy HH:mm' }, [rules.after(1, 'day')]),
    location: schema.string(),
    serviceCategoryId: schema.number(),
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
