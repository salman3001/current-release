import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cart from 'App/Models/Cart'
import BaseController from './BaseController'
import CreateCartValidator from 'App/Validators/CreateCartValidator'
import UpdateCartValidator from 'App/Validators/UpdateCartValidator'

export default class CartsController extends BaseController {
  constructor() {
    super(Cart, CreateCartValidator, UpdateCartValidator)
  }

  public async store({ request, response, bouncer }: HttpContextContract): Promise<void> {
    const payload = await request.validate(CreateCartValidator)
    const { items, ...cartPayload } = payload
    const cart = await Cart.create(cartPayload)
    if (items) {
      await cart.related('items').createMany(items)
    }
    return response.json({ message: 'Cart Created successfully', data: cart })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract): Promise<void> {
    const cart = await Cart.findOrFail(+params.id)
    const payload = await request.validate(UpdateCartValidator)

    await cart.load('items')

    if (cart.items) {
      for (const item of cart.items) {
        await item.delete()
      }

      await cart.related('items').createMany(payload.items)
    } else {
    }

    return response.json({ message: 'CartItem Updated', data: cart })
  }
}
