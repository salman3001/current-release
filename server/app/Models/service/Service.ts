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
  public locationSpecific: boolean

  @column()
  public businessId: number

  @belongsTo(() => User)
  public business: BelongsTo<typeof User>

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @hasOne(() => Video)
  public video: HasOne<typeof Video>

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
    await service.load('images')
    await service.load('video')
    await service.load('variants')

    if (service.images) {
      await Promise.all(
        service.images.map(async (img) => {
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
