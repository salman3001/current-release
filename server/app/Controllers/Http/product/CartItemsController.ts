import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CartItem from 'App/Models/product/CartItem'
import BaseController from '../BaseController'
import CreateCartItemValidator from 'App/Validators/CreateCartItemValidator'
import UpdateCartItemValidator from 'App/Validators/UpdateCartItemValidator'

export default class CartItemsController extends BaseController {
  constructor() {
    super(CartItem, CreateCartItemValidator, UpdateCartItemValidator)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const payload = await request.validate(CreateCartItemValidator)
    const item = await CartItem.create(payload)
    return response.custom({
      message: 'Cart Item Added',
      code: 201,
      data: item,
      status: true,
      alertType: 'success'
    })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    const item = await CartItem.findOrFail(+params.id)
    const payload = await request.validate(UpdateCartItemValidator)

    item.merge(payload)

    await item.save()
    return response.custom({
      message: 'Cart Item Updated',
      code: 201,
      data: item,
      status: true,
      alertType: 'success'
    })
  }
}
