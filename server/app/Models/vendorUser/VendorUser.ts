import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  HasOne,
  ManyToMany,
  afterCreate,
  beforeSave,
  column,
  computed,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Business from './Business'
import Notification from '../Notification'
import UserProfile from '../UserProfile'
import Hash from '@ioc:Adonis/Core/Hash'
import ServiceCategory from '../service/ServiceCategory'
import Booking from '../bookings/Booking'
import BidBooking from '../bookings/BidBooking'

export default class VendorUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public phone: string

  @column()
  public isActive: boolean

  @column()
  public isPublic: boolean

  @column({ serializeAs: null })
  public token: string | null

  @column({ serializeAs: null })
  public socketToken: string

  @computed()
  public get userType() {
    return 'vendor'
  }

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasOne(() => Business)
  public business: HasOne<typeof Business>

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @manyToMany(() => ServiceCategory, {
    pivotTable: 'vendor_subscribed_categories',
  })
  public subscribedCategories: ManyToMany<typeof ServiceCategory>

  @hasMany(() => BidBooking)
  public bidBooking: HasMany<typeof BidBooking>

  // @hasMany(() => SupportTicket)
  // public supportTickets: HasMany<typeof SupportTicket>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async createProfile(user: VendorUser) {
    await user.related('profile').create({})
  }

  @beforeSave()
  public static async hashPassword(user: VendorUser) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
