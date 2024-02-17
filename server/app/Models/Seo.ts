import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Seo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public metaTitle: string

  @column()
  public metaKeywords: string

  @column()
  public metaDesc: string

  @column()
  public productSubcategoryId: number

  @column()
  public productCategoryId: number

  @column()
  public productTagId: number

  @column()
  public productId: number
}
