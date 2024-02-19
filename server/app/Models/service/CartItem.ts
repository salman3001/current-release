import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import ServiceVariant from './ServiceVariant'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public qty: number

  @column()
  public cartId: number

  @column()
  public serviceVariantId: number

  @belongsTo(() => ServiceVariant)
  public serviceVariant: BelongsTo<typeof ServiceVariant>

  @computed()
  public itemTotal(model: CartItem): number {
    return model.qty * model.serviceVariant.price
  }
}
