import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  afterCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import ServiceCategory from '../service/ServiceCategory'
import User from '../user/User'
import Bid from './Bid'
import { BudgetType, NotificationTypes } from 'App/Helpers/enums'
import VendorUser from '../vendorUser/VendorUser'

export default class ServiceRequirement extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public desc: string

  @column({ prepare: (v) => JSON.stringify(v) })
  public skillsRequired: string[]

  @column()
  public budgetType: BudgetType

  @column()
  public budget: string | number

  @column.dateTime()
  public expiresAt: DateTime

  @column()
  public location: string

  @column()
  public userId: number

  @column()
  public serviceCategoryId: number

  @column()
  public acceptedBidId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => ServiceCategory)
  public serviceCategory: BelongsTo<typeof ServiceCategory>

  @hasMany(() => Bid)
  public recievedBids: HasMany<typeof Bid>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async notifyVendor(serviceRequirement: ServiceRequirement) {
    const categoryId = serviceRequirement.serviceCategoryId

    const vendors = await VendorUser.query().whereHas('subscribedCategories', (b) => {
      b.where('service_category_id', categoryId)
    })

    for (const vendor of vendors) {
      await vendor.related('notifications').create({
        data: {
          type: NotificationTypes.SERVICE_REQUIREMENT_ADDED,
          message: 'New Service Requirement Added',
          meta: {
            id: serviceRequirement.id,
            title: serviceRequirement.title,
          },
        },
      })
    }
  }
}
