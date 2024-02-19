import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ServiceSubcategory from './service/ServiceSubcategory'
import ServiceCategory from './service/ServiceCategory'
import ServiceTag from './service/ServiceTag'
import Service from './service/Service'

export default class Faq extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public quest: string

  @column()
  public ans: string

  @column()
  public serviceSubcategoryId: number

  @belongsTo(() => ServiceSubcategory)
  public serviceSubcategory: BelongsTo<typeof ServiceSubcategory>

  @column()
  public serviceCategoryId: number

  @belongsTo(() => ServiceCategory)
  public serviceCategory: BelongsTo<typeof ServiceCategory>

  @column()
  public serviceId: number

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @column()
  public serviceTagId: number

  @belongsTo(() => ServiceTag)
  public serviceTag: BelongsTo<typeof ServiceTag>

  @column()
  public serviceId: number
}
