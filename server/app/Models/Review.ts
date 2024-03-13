import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './user/User'
import VendorUser from './vendorUser/VendorUser'
import Service from './service/Service'
import BigNumber from 'bignumber.js'

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

  @afterCreate()
  public static async setAvgRating(review: Review) {
    console.log('ran');


    if (review.serviceId) {
      const service = await Service.query().where('id', review.serviceId).withAggregate('reviews', b => {
        b.avg('rating').as('avg_rating')
      }).first()

      console.log(service?.$extras);

      if (service) {
        service.avgRating = service.$extras?.avg_rating || 0
        await service.save()

        const vendor = await VendorUser.query().where('id', service.vendorUserId).withAggregate('services', s => {
          s.avg('avg_rating').as('service_avg_rating')
        }).withAggregate('reviews', b => {
          b.avg('rating').as('vendor_avg_rating')
        }).first()

        console.log(vendor?.$extras);


        if (vendor) {
          vendor.avgRating = new BigNumber(vendor.$extras?.service_avg_rating || 0).plus(vendor.$extras?.vendor_avg_rating || 0).dividedBy(0).toFixed(1)
          await vendor.save()
        }
      }


    }

    if (review.vendorUserId) {
      const vendor = await VendorUser.query().where('id', review.vendorUserId).withAggregate('services', s => {
        s.avg('avg_rating').as('service_avg_rating')
      }).withAggregate('reviews', b => {
        b.avg('rating').as('vendor_avg_rating')
      }).first()
      console.log(vendor?.$extras);

      if (vendor) {
        vendor.avgRating = new BigNumber(vendor.$extras?.service_avg_rating || 0).plus(vendor.$extras?.vendor_avg_rating || 0).dividedBy(0).toFixed(1)
        await vendor.save()
      }
    }
  }
}
