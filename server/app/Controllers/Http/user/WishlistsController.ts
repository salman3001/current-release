import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import WishlistUpdateValidator from 'App/Validators/WishlistUpdateValidator'
import Wishlist from 'App/Models/user/Wishlist'
import BaseApiController from '../BaseApiController'

export default class WishlistsController extends BaseApiController {
  public async index({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('viewList')
    const wishlistQuery = Wishlist.query()

    this.applyFilters(wishlistQuery, request.qs(), { searchFields: ['slug'] })

    this.extraFilters(wishlistQuery, request)

    const wishlist = await this.paginate(request, wishlistQuery)

    return response.custom({
      code: 200,
      data: wishlist,
      success: true,
      message: null,
    })
  }

  public async show({ response, bouncer, params }: HttpContextContract) {
    const id = params.id
    await bouncer.with('WishlistPolicy').authorize('view')

    const wishlist = await Wishlist.query().where('id', id).firstOrFail()

    return response.custom({
      code: 200,
      success: true,
      message: null,
      data: wishlist,
    })
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('update')

    let wishlist: Wishlist | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })

      const payload = await request.validate(WishlistUpdateValidator)

      await wishlist.load('items')

      if (wishlist.items) {
        await wishlist.related('items').detach(payload.serviceVariantIds)
      }

      await wishlist.related('items').attach(payload.serviceVariantIds)
    })

    await wishlist!.load('items')

    return response.custom({
      message: 'Wishlist Updated',
      code: 201,
      data: wishlist,
      success: true,
    })
  }

  public async deleteItem({ response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('delete')

    const itemId = params.itemId

    let wishlist: Wishlist | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })
      await wishlist.related('items').detach([itemId])
    })

    await wishlist!.load('items')

    return response.custom({
      message: 'Wishlist item deleted',
      code: 201,
      data: wishlist,
      success: true,
    })
  }

  public async clear({ response, bouncer, auth }: HttpContextContract) {
    await bouncer.with('WishlistPolicy').authorize('delete')

    let wishlist: Wishlist | null = null
    const user = auth.user

    await Database.transaction(async (trx) => {
      wishlist = await Wishlist.findByOrFail('user_id', user!.id, { client: trx })
      await wishlist.related('items').detach()
    })

    await wishlist!.load('items')

    return response.custom({
      message: 'Wishlist cleared',
      code: 200,
      data: wishlist,
      success: true,
    })
  }

  public async destroy({ params, response, bouncer }: HttpContextContract) {
    const wishList = await Wishlist.findOrFail(+params.id)

    await bouncer.with('WishlistPolicy').authorize('delete')

    await wishList.delete()

    return response.custom({
      code: 200,
      success: true,
      message: 'Record Deleted',
      data: wishList,
    })
  }
}
