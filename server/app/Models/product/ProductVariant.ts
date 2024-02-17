import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Product from './Product'
import ProductProperty from './ProductProperty'

export default class ProductVariant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public price: number

  @column()
  public availableQty: number

  @responsiveAttachment({
    folder: 'product/variants/images',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public image: ResponsiveAttachmentContract

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @hasMany(() => ProductProperty)
  public properties: HasMany<typeof ProductProperty>

}
