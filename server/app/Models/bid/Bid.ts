import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ServiceRequirement from './ServiceRequirement'
import VendorUser from '../vendorUser/VendorUser'

export default class Bid extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public offeredPrice: number | string

  @column()
  public serviceRequirementId: number

  @column()
  public vendorUserId: number

  @belongsTo(() => VendorUser)
  public vendorUser: BelongsTo<typeof VendorUser>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
