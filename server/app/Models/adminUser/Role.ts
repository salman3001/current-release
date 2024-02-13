import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import AdminUser from './AdminUser'
import Permission from './Permission'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public isActive: boolean

  @hasMany(() => AdminUser)
  public AdminUser: HasMany<typeof AdminUser>

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>
}
