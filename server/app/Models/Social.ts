import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Social extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public website: string

  @column()
  public facebook: string

  @column()
  public twitter: string

  @column()
  public instagram: string

  @column()
  public pintrest: string

  @column()
  public linkedin: string

  @column()
  public vk: string

  @column()
  public whatsapp: string

  @column()
  public telegram: string

  @column()
  public adminUserId: number

  @column()
  public userId: number

  @column()
  public productId: number

  @column()
  public serviceId: number
}
