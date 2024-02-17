import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import ProductVariant from './ProductVariant'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public qty: number

  @column()
  public cartId: number

  @column()
  public productVariantId: number

  @belongsTo(() => ProductVariant)
  public productVariant: BelongsTo<typeof ProductVariant>

  @computed()
  public itemTotal(model: CartItem): number {
    return model.qty * model.productVariant.price
  }

}
