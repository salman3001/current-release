import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  afterCreate,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Business from './Business'
import Notification from '../Notification'
import UserProfile from '../UserProfile'

export default class VenderUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public phone: string

  @column()
  public isActive: boolean

  @column()
  public isPublic: boolean

  @column({ serializeAs: null })
  public token: string | null

  @column({ serializeAs: null })
  public socketToken: string

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasMany(() => Business)
  public business: HasMany<typeof Business>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  // @hasMany(() => SupportTicket)
  // public supportTickets: HasMany<typeof SupportTicket>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async createProfile(user: VenderUser) {
    await user.related('profile').create({})
  }
}
