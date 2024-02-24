import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  afterCreate,
  beforeSave,
  column,
  computed,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Business from './Business'
import Notification from '../Notification'
import UserProfile from '../UserProfile'
import Hash from '@ioc:Adonis/Core/Hash'

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

  @computed()
  public get userType() {
    return 'vendor'
  }

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasOne(() => Business)
  public business: HasOne<typeof Business>

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

  @beforeSave()
  public static async hashPassword(user: VenderUser) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
