import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FavoriteLink extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public link: string

  @column()
  public userProfileId: number
}
