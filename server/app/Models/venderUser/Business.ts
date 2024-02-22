import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Seo from '../Seo'
import Social from '../Social'
import Faq from '../Faq'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Image from '../Image'
import Service from '../service/Service'
import VenderUser from './VenderUser'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Address from '../address/Address'
import Review from '../service/Review'

export default class Business extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public isActive: boolean

  @responsiveAttachment({
    folder: 'business/logos',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public logo: ResponsiveAttachmentContract

  @responsiveAttachment({
    folder: 'business/covers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public cover: ResponsiveAttachmentContract

  @responsiveAttachment({
    folder: 'business/brochers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public brocher: ResponsiveAttachmentContract

  @attachment({
    folder: 'business/videos',
    preComputeUrl: true,
  })
  public video: AttachmentContract

  @column()
  public venderUserId: number

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasMany(() => Faq)
  public faq: HasMany<typeof Faq>

  @hasOne(() => Address)
  public addresses: HasOne<typeof Address>

  @belongsTo(() => VenderUser)
  public vender: BelongsTo<typeof VenderUser>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
