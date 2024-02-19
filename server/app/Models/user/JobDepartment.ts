import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class JobDepartment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  name: string
}
