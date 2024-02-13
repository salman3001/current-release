import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Street from './Street'
import State from './State'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isActive: boolean

  @column()
  public stateId: number

  @belongsTo(() => State)
  public state: BelongsTo<typeof State>

  @hasMany(() => Street)
  public street: HasMany<typeof Street>
}
