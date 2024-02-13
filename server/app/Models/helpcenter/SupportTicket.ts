import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { TicketStatus } from 'App/Helpers/enums'
import User from '../user/User'
import ChatMessage from './ChatMessage'

export default class SupportTicket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public subject: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public status: TicketStatus

  @hasMany(() => ChatMessage)
  public messages: HasMany<typeof ChatMessage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
