import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './user/User'
import VendorUser from './vendorUser/VendorUser'
import Service from './service/Service'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rating: number

  @column()
  public message: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public vendorUserId: number

  @column()
  public serviceId: number

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @afterCreate()
  // public static async setAvgRating(review: Review) {
  //   if (review.serviceId) {
  //     const service = await Service.query().where('id', review.serviceId).withAggregate('reviews', b => {
  //       b.avg('rating').as('avg_rating')
  //     }).first()
  //     if (service) {
  //       service.avgRating = service.$extras?.avg_rating || 0

  //       const vendor = await VendorUser.query().where('id', service.bus)

  //     }


  //   }

  // }

  // const vendor = 
}
