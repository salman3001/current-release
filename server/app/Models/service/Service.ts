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
import ServiceCategory from './ServiceCategory'
import ServiceSubcategory from './ServiceSubcategory'
import ServiceTag from './ServiceTag'
import Seo from '../Seo'
import Image from '../Image'
import Faq from '../Faq'
import Review from './Review'
import ServiceVariant from './ServiceVariant'
import Business from '../venderUser/Business'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'

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
  public isActive: boolean

  @column()
  public locationSpecific: boolean

  @column()
  public geoLocation: string

  @responsiveAttachment({
    folder: 'service/covers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public cover: ResponsiveAttachmentContract

  @responsiveAttachment({
    folder: 'service/brochers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public brocher: ResponsiveAttachmentContract

  @attachment({
    folder: 'service/videos',
  })
  public video: AttachmentContract

  @column()
  public businessId: number

  @column()
  public serviceCategoryId: number

  @column()
  public serviceSubcategoryId: number

  @belongsTo(() => Business)
  public business: BelongsTo<typeof Business>

  @belongsTo(() => ServiceCategory)
  public serviceCategory: BelongsTo<typeof ServiceCategory>

  @belongsTo(() => ServiceSubcategory)
  public serviceSubcategory: BelongsTo<typeof ServiceSubcategory>

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

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
    await service.load('images')
    await service.load('variants')

    if (service.images) {
      await Promise.all(
        service.images.map(async (img) => {
          await img.delete()
        })
      )
    }

    if (service.variants) {
      for (const v of service.variants) {
        await v.delete()
      }
    }
  }
}
