import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Education extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public institute: string

  @column()
  public degree: string

  @column()
  public field: string

  @column.date()
  public startDate: DateTime

  @column.date()
  public endDate: DateTime

  @column()
  public desc: string

  @column()
  public userProfileId: number
}
