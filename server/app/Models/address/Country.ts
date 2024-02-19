import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import State from './State'
import Continent from './Continent'

export default class Country extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isActive: boolean

  @column()
  public continentId: number

  @belongsTo(() => Continent)
  public continent: BelongsTo<typeof Continent>

  @hasMany(() => State)
  public state: HasMany<typeof State>
}
