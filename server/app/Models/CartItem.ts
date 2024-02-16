import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { CartItemType } from 'App/Helpers/enums'
import Product from './product/Product'
import Service from './service/Service'
import Cart from './Cart'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: CartItemType

  @column()
  public qty: number

  @column()
  public productId: number

  @column()
  public serviceId: number

  @column()
  public cartId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
