import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  belongsTo,
  BelongsTo,
  afterCreate,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import UserProfile from '../UserProfile'
import Activity from '../Activity'

export default class AdminUser extends BaseModel {
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
  public token: string | null

  @column({ serializeAs: null })
  public socketToken: string

  @column()
  public isActive: boolean

  @column()
  public isAdmin: boolean

  @column()
  public roleId: number

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Activity)
  public activities: HasMany<typeof Activity>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(adminUser: AdminUser) {
    if (adminUser.$dirty.password) {
      adminUser.password = await Hash.make(adminUser.password)
    }

    if (adminUser.$dirty.email) {
      adminUser.email = adminUser.email.toLowerCase()
    }
  }

  @afterCreate()
  public static async createProfile(adminUser: AdminUser) {
    await adminUser.related('profile').create({})
  }
}
