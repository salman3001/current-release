import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) { }

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro('custom', function (opt: {
      code: number,
      data: null | Record<any, any>,
      message: string
      status: boolean,
      alertType: 'success' | 'info' | 'warning' | 'warning' | 'error' | null
    }) {
      this.status(opt.code).send({
        message: opt.message,
        data: opt.data,
        status: opt.status,
        alertType: opt.alertType
      })
      return this
    })
  }

  public async ready() {
    // App is ready
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
