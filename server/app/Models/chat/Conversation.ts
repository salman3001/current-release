import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ConversationParticipant from './ConversationParticipant'
import Message from './Message'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public participantOneId: number

  @column()
  public participantTwoId: number

  @belongsTo(() => ConversationParticipant, {
    foreignKey: 'participant_one_id',
  })
  public participantOne: BelongsTo<typeof ConversationParticipant>

  @belongsTo(() => ConversationParticipant, {
    foreignKey: 'participant_two_id',
  })
  public participantTwo: BelongsTo<typeof ConversationParticipant>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
