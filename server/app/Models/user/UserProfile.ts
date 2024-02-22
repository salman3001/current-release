import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, HasOne, ManyToMany, belongsTo, column, hasMany, hasOne, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { ResponsiveAttachmentContract, responsiveAttachment } from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Social from '../Social'
import Address from '../address/Address'
import Experience from './Experience'
import Education from './Education'
import Language from '../Language'
import Skill from './Skill'
import FavoriteLink from '../FavoriteLink'
import NotificationSetting from '../NotificationSetting'
import User from './User'

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @responsiveAttachment({
    folder: 'user',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public avatar: ResponsiveAttachmentContract

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasMany(() => Address)
  public address: HasMany<typeof Address>

  @hasMany(() => Experience)
  public experiences: HasMany<typeof Experience>

  @hasMany(() => Education)
  public educations: HasMany<typeof Education>

  @manyToMany(() => Language, {
    pivotColumns: ['proficiency'],
    pivotTable: 'user_languages',
  })
  public languages: ManyToMany<typeof Language>

  @manyToMany(() => Skill, {
    pivotTable: 'user_skills',
  })
  public skills: ManyToMany<typeof Skill>

  @hasMany(() => FavoriteLink)
  public favoriteLinks: HasMany<typeof FavoriteLink>

  @hasOne(() => NotificationSetting)
  public NotificationSetting: HasOne<typeof NotificationSetting>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
