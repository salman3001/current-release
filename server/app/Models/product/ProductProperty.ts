import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProductProperty extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public value: string

  @column()
  public productVariantId: number

}
