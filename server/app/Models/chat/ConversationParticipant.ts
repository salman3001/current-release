import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { userTypes } from 'App/Helpers/enums'
import AdminUser from '../adminUser/AdminUser'
import VendorUser from '../vendorUser/VendorUser'
import User from '../user/User'
import Conversation from './Conversation'

export default class ConversationParticipant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userType: userTypes

  @column()
  public conversationId: number

  @column()
  public userId: number

  @column()
  public vendorUserId: number

  @column()
  public adminUserId: number

  @belongsTo(() => Conversation)
  public conversation: BelongsTo<typeof Conversation>

  @belongsTo(() => AdminUser)
  public adminUser: BelongsTo<typeof AdminUser>

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
