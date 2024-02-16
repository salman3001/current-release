import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  ManyToMany,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from '../user/User'
import ServiceCategory from './ServiceCategory'
import ServiceSubcategory from './ServiceSubcategory'
import Seo from '../Seo'
import ServiceTag from './ServiceTag'
import Faq from '../Faq'
import Social from '../Social'
import Address from '../address/Address'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import Image from '../Image'
import Video from '../Video'
import Review from '../Review'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public companyName: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public status: boolean

  @column()
  public specificLocation: boolean

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public serviceCategoryId: number

  @belongsTo(() => ServiceCategory)
  public serviceCategory: BelongsTo<typeof ServiceCategory>

  @column()
  public serviceSubcategoryId: number

  @belongsTo(() => ServiceSubcategory)
  public serviceSubcategory: BelongsTo<typeof ServiceSubcategory>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasOne(() => Address)
  public address: HasOne<typeof Address>

  @hasMany(() => Faq)
  public faqs: HasMany<typeof Faq>

  @manyToMany(() => ServiceTag, {
    pivotTable: 'service_tags_pivot',
  })
  public tags: ManyToMany<typeof ServiceTag>

  @responsiveAttachment({
    folder: 'service/logo',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public logo: ResponsiveAttachmentContract

  @hasMany(() => Image)
  public screenshots: HasMany<typeof Image>

  @responsiveAttachment({
    folder: 'service/cover',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public cover: ResponsiveAttachmentContract

  @hasOne(() => Video)
  public video: HasOne<typeof Video>

  @responsiveAttachment({
    folder: 'service/brocher',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public brocher: ResponsiveAttachmentContract

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
