import { DateTime } from 'luxon'
import { BaseModel, HasOne, ManyToMany, column, hasOne, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Interest from './Interest'
import Image from '../Image'

export default class Subscriber extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  firstName: string

  @column()
  lastName: string

  @column()
  email: string

  @column()
  phone: string

  @column()
  status: boolean

  @column.dateTime({
    // serialize: (value) => value.toFormat('dd/MM/yyyy'),
  })
  dob: DateTime

  @manyToMany(() => Interest, {
    pivotTable: 'subscriber_interests_pivot',
  })
  public interests: ManyToMany<typeof Interest>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
