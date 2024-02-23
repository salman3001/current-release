import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  /**
   * Handle request
   */
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */
    if (await auth.use('adminUserApi').check()) {
      auth.defaultGuard = 'adminUserApi'
      return await next()
    } else if (await auth.use('venderUserApi').check()) {
      auth.defaultGuard = 'venderUserApi'
      return await next()
    } else if (await auth.use('userApi').check()) {
      auth.defaultGuard = 'userApi'
      return await next()
    } else {
      await next()
    }
  }
}
