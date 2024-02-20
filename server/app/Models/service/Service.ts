import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  HasOne,
  ManyToMany,
  beforeDelete,
  belongsTo,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from '../user/User'
import ServiceCategory from './ServiceCategory'
import ServiceSubcategory from './ServiceSubcategory'
import ServiceTag from './ServiceTag'
import Seo from '../Seo'
import Image from '../Image'
import Faq from '../Faq'
import Social from '../Social'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Video from '../Video'
import Review from './Review'
import ServiceVariant from './ServiceVariant'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

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

  @responsiveAttachment({
    folder: 'service/logos',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public logo: ResponsiveAttachmentContract

  @hasMany(() => Image)
  public screenshots: HasMany<typeof Image>

  @responsiveAttachment({
    folder: 'service/covers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public cover: ResponsiveAttachmentContract

  @hasOne(() => Video)
  public video: HasOne<typeof Video>

  @responsiveAttachment({
    folder: 'service/brochers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public brocher: ResponsiveAttachmentContract

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

  @hasMany(() => Faq)
  public faq: HasMany<typeof Faq>

  @manyToMany(() => ServiceTag, {
    pivotTable: 'service_tags_pivot',
  })
  public tags: ManyToMany<typeof ServiceTag>

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  @hasMany(() => ServiceVariant)
  public variants: HasMany<typeof ServiceVariant>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteRelations(service: Service) {
    await service.load('screenshots')
    await service.load('video')
    await service.load('variants')

    if (service.screenshots) {
      await Promise.all(
        service.screenshots.map(async (img) => {
          await img.delete()
        })
      )
    }

    if (service.video) {
      await service.video.delete()
    }

    if (service.variants) {
      for (const v of service.variants) {
        await v.delete()
      }
    }
  }
}
