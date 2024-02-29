import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  afterCreate,
  hasMany,
  HasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import Cart from './Cart'
import Notification from '../Notification'
import UserProfile from '../UserProfile'
import Wishlist from './Wishlist'
import BidOrder from '../orders/BidOrder'
import OrderGroup from '../orders/OrderGroup'

export default class User extends BaseModel {
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
    return 'customer'
  }

  @hasOne(() => UserProfile)
  public profile: HasOne<typeof UserProfile>

  @hasMany(() => Notification)
  public notifications: HasMany<typeof Notification>

  @hasMany(() => OrderGroup)
  public orders: HasMany<typeof OrderGroup>

  @hasOne(() => Cart)
  public cart: HasOne<typeof Cart>

  @hasOne(() => Wishlist)
  public wishlist: HasOne<typeof Wishlist>

  @hasMany(() => BidOrder)
  public bidOrders: HasMany<typeof BidOrder>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterCreate()
  public static async createCart(User: User) {
    await User.related('cart').create({})
    await User.related('profile').create({})
    await User.related('wishlist').create({})
  }
}
