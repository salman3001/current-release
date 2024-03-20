import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Conversation from './Conversation'
import Ws from 'App/services/Ws'
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public body: string

  @column()
  public userIdentifier: string

  @column()
  public read: boolean

  @column()
  public conversationId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Conversation)
  public conversation: BelongsTo<typeof Conversation>

  @afterCreate()
  public static pushNotification(message: Message) {
    const ctx = HttpContext.get()
    const user = ctx?.auth.user
    let room = `${user?.userType}-${user!.id}-chats`
    Ws.io.of('/chat/').to(room).emit(`on-coversation-${message.conversationId}-message`, message)
  }
}
