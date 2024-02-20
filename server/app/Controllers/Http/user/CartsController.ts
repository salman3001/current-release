import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cart from 'App/Models/user/Cart'
import BaseController from '../BaseController'
import UpdateCartValidator from 'App/Validators/UpdateCartValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CartsController extends BaseController {
  constructor() {
    super(Cart, UpdateCartValidator, UpdateCartValidator)
  }

  public getShowQuery(ctx: HttpContextContract) {
    const user = ctx.auth.user
    if (!user) {
      return ctx.response.custom({
        code: 401,
        data: null,
        message: 'Not Authorized',
        success: false,
      })
    }
    return Cart.query().where('user_id', user!.id)
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const cart: Cart | null = null
    const userId = auth.user?.id

    if (!userId) {
      return response.custom({
        code: 401,
        data: null,
        message: 'Unauthorized to perform this action',
        success: false,
      })
    }

    await Database.transaction(async (trx) => {
      const cart = await Cart.findByOrFail('user_id', userId, { client: trx })
      await bouncer.with('CartPolicy').authorize('update', cart)

      const payload = await request.validate(UpdateCartValidator)

      await cart.load('items')

      if (cart.items) {
        for (const item of cart.items) {
          item.useTransaction(trx)
          await item.delete()
        }
        await cart.related('items').createMany(payload.items)
      }
    })

    return response.custom({
      message: 'Cart Updated',
      code: 201,
      data: cart,
      success: true,
    })
  }
}
