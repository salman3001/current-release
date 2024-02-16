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
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Address from '../address/Address'
import Social from '../Social'
import {
  responsiveAttachment,
  ResponsiveAttachmentContract,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Activity from '../Activity'
import Notifications from '../Notification'
import { convertKeysToCamelCase } from 'App/Helpers/toCamelCase'

export default class AdminUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public socketToken: string

  @column()
  public rememberMeToken: string | null

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public phone: string

  @column()
  public desc: string

  @column()
  public isActive: boolean

  @column()
  public isAdmin: boolean

  @column()
  public roleId: number

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasOne(() => Address, {
    foreignKey: 'adminUserId',
  })
  public address: HasOne<typeof Address>

  @hasMany(() => Activity)
  public activities: HasMany<typeof Activity>

  @hasMany(() => Notifications)
  public notifications: HasMany<typeof Notifications>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @responsiveAttachment({
    folder: 'admin-user',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public avatar: ResponsiveAttachmentContract

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
}
