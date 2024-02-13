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
import ProductCategory from './ProductCategory'
import ProductSubcategory from './ProductSubcategory'
import ProductTag from './ProductTag'
import Seo from '../Seo'
import Image from '../Image'
import Faq from '../Faq'
import Social from '../Social'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'
import Video from '../Video'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public companyName: string

  @column()
  public phone: string

  @column()
  public email: string

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
  public productCategoryId: number

  @belongsTo(() => ProductCategory)
  public productCategory: BelongsTo<typeof ProductCategory>

  @column()
  public productSubcategoryId: number

  @belongsTo(() => ProductSubcategory)
  public productSubcategory: BelongsTo<typeof ProductSubcategory>

  @hasOne(() => Seo)
  public seo: HasOne<typeof Seo>

  @hasOne(() => Social)
  public social: HasOne<typeof Social>

  @hasMany(() => Faq)
  public faq: HasMany<typeof Faq>

  @manyToMany(() => ProductTag, {
    pivotTable: 'product_tags_pivot',
  })
  public tags: ManyToMany<typeof ProductTag>

  @responsiveAttachment({
    folder: 'product/logos',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public logo: ResponsiveAttachmentContract

  @hasMany(() => Image)
  public screenshots: HasMany<typeof Image>

  @responsiveAttachment({
    folder: 'product/covers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public cover: ResponsiveAttachmentContract

  @hasOne(() => Video)
  public video: HasOne<typeof Video>

  @responsiveAttachment({
    folder: 'product/brochers',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public brocher: ResponsiveAttachmentContract

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
