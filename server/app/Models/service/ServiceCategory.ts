import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  column,
  computed,
  hasMany,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Faq from '../Faq'
import Seo from '../Seo'
import Service from './Service'
import ServiceSubcategory from './ServiceSubcategory'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class ServiceCategory extends BaseModel {
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

  @responsiveAttachment({
    folder: 'service-category',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public thumbnail: ResponsiveAttachmentContract

  @hasMany(() => ServiceSubcategory)
  public subCategory: HasMany<typeof ServiceSubcategory>

  @hasMany(() => Faq)
  public faqs: HasMany<typeof Faq>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @computed()
  public get subCategoryCount() {
    let count = 0
    if (this.subCategory) {
      count = this.subCategory.length
    }

    return count
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
