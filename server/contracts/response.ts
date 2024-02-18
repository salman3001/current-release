declare module '@ioc:Adonis/Core/Response' {
    interface ResponseContract {
        custom(opt: {
            code: number,
            data: null | Record<any, any>,
            message: string
            status: boolean,
            alertType: 'success' | 'info' | 'warning' | 'warning' | 'error' | null
        }): this
    }
}