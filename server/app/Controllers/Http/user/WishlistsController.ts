import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from '../BaseController'
import Database from '@ioc:Adonis/Lucid/Database'
import WishlistUpdateValidator from 'App/Validators/WishlistUpdateValidator'
import Wishlist from 'App/Models/user/Wishlist'

export default class WishlistsController extends BaseController {
  constructor() {
    super(Wishlist, WishlistUpdateValidator, WishlistUpdateValidator, 'WishlistPolicy')
  }

  public async show(ctx: HttpContextContract) {
    await ctx.bouncer.with('WishlistPolicy').authorize('view')
    const user = ctx.auth.user

    const wishlistQuery = Wishlist.query().where('user_id', user!.id)
    this.showfilterQuery(ctx.request.qs() as any, wishlistQuery)

    if (ctx.request.qs().populate) {
      await this.populate(ctx.request.qs().populate, wishlistQuery)
    }

    const wishlist = await wishlistQuery.first()
    return ctx.response.custom({
      code: 200,
      data: wishlist,
      message: null,
      success: true,
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
}
