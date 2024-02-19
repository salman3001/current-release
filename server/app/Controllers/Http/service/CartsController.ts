import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cart from 'App/Models/service/Cart'
import BaseController from '../BaseController'
import UpdateCartValidator from 'App/Validators/UpdateCartValidator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CartsController extends BaseController {
  constructor() {
    super(Cart, {}, UpdateCartValidator)
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    const cart: Cart | null = null

    await Database.transaction(async (trx) => {
      const cart = await Cart.findOrFail(+params.id, { client: trx })

      const payload = await request.validate(UpdateCartValidator)

      await cart.load('items')

      if (cart.items) {
        for (const item of cart.items) {
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
