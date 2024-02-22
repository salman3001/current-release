import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VenderUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // @hasMany(() => SupportTicket)
  // public supportTickets: HasMany<typeof SupportTicket>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
