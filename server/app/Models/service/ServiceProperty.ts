import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ServiceProperty extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public value: string

  @column()
  public serviceVariantId: number
}
