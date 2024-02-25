import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, afterCreate, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { NotificationTypes, OrderStatus } from 'App/Helpers/enums'
import User from './user/User'
import VendorUser from './vendorUser/VendorUser'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public vendorUserId: number

  @column({ prepare: (v) => JSON.stringify(v) })
  public orderDetail: Object

  @column({ prepare: (v) => JSON.stringify(v) })
  public paymentDetail: Object

  @column()
  public status: OrderStatus

  @column()
  public total: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => VendorUser)
  public vendor: BelongsTo<typeof VendorUser>

  @afterCreate()
  public static async notifyUsers(order: Order) {
    const user = await User.query().where('id', order.userId).first()
    const vendor = await VendorUser.query().where('id', order.vendorUserId).first()

    if (user) {
      user.related('notifications').create({
        data: {
          type: NotificationTypes.ORDER_CREATED,
          message: 'New Order Created',
          meta: {
            orderId: order.id,
          },
        },
      })
    }

    if (vendor) {
      vendor.related('notifications').create({
        data: {
          type: NotificationTypes.ORDER_CREATED,
          message: 'New Order Receieved',
          meta: {
            orderId: order.id,
          },
        },
      })
    }
  }
}
