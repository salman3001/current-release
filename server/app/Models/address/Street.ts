import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import City from './City'

export default class Street extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isActive: boolean

  @column()
  public cityId: number

  @belongsTo(() => City)
  public city: BelongsTo<typeof City>
}
