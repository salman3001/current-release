import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import ServiceVariant from '../service/ServiceVariant'

export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @manyToMany(() => ServiceVariant, {
    pivotTable: 'wishlist_items',
  })
  public items: ManyToMany<typeof ServiceVariant>

}
