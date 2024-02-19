import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import BlogCategory from './BlogCategory'
import Language from '../Language'
import {
  ResponsiveAttachmentContract,
  responsiveAttachment,
} from '@ioc:Adonis/Addons/ResponsiveAttachment'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @responsiveAttachment({
    folder: 'blogs',
    preComputeUrls: true,
    forceFormat: 'webp',
    disableThumbnail: true,
    responsiveDimensions: false,
  })
  public thumbnail: ResponsiveAttachmentContract

  @manyToMany(() => BlogCategory, {
    pivotTable: 'blog_categories_pivot',
  })
  public category: ManyToMany<typeof BlogCategory>

  @column()
  public languageId: number

  @belongsTo(() => Language)
  public language: BelongsTo<typeof Language>

  @column()
  public shortDesc: string

  @column()
  public longDesc: string

  @column()
  public isPublished: boolean

  @column()
  public metaTitle: string

  @column()
  public metaKeywords: string

  @column()
  public metaDesc: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
