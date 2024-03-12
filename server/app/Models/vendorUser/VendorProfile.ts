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
import VendorUser from './VendorUser'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Address from '../address/Address'

export default class VendorProfile extends BaseModel {
  public serializeExtras = true
  @column({ isPrimary: true })
  public id: number

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public isActive: boolean

  @responsiveAttachment({
    folder: 'vendor',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public avatar: ResponsiveAttachmentContract

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
  })
  public video: AttachmentContract

  @column()
  public vendorUserId: number

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasMany(() => Faq)
  public faq: HasMany<typeof Faq>

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @belongsTo(() => VendorUser)
  public vendor: BelongsTo<typeof VendorUser>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
