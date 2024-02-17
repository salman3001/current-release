import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ProductSubcategory from './product/ProductSubcategory'
import ProductCategory from './product/ProductCategory'
import ProductTag from './product/ProductTag'
import Product from './product/Product'

export default class Faq extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public quest: string

  @column()
  public ans: string

  @column()
  public productSubcategoryId: number

  @belongsTo(() => ProductSubcategory)
  public productSubcategory: BelongsTo<typeof ProductSubcategory>

  @column()
  public productCategoryId: number

  @belongsTo(() => ProductCategory)
  public productCategory: BelongsTo<typeof ProductCategory>

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column()
  public productTagId: number

  @belongsTo(() => ProductTag)
  public productTag: BelongsTo<typeof ProductTag>

  @column()
  public serviceId: number
}
