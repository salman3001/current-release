import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import City from './City'
import Country from './Country'

export default class State extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isActive: boolean

  @column()
  public countryId: number

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @hasMany(() => City)
  public city: HasMany<typeof City>
}
