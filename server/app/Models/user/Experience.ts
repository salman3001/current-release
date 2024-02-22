import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import JobIndustry from './JobIndustry'
import City from '../address/City'
import State from '../address/State'
import JobDepartment from './JobDepartment'
import Country from '../address/Country'

export default class Experience extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public jobIndustryId: number

  @belongsTo(() => JobIndustry)
  public industry: BelongsTo<typeof JobIndustry>

  @column()
  public jobFunction: string

  @column()
  public jobTitle: string

  @column()
  public jobDepartmentId: number

  @belongsTo(() => JobDepartment)
  public department: BelongsTo<typeof JobDepartment>

  @column()
  public companyName: string

  @column()
  public companySize: string

  @column()
  public cityId: number

  @belongsTo(() => City)
  public city: BelongsTo<typeof City>

  @column()
  public stateId: number

  @belongsTo(() => State)
  public state: BelongsTo<typeof State>

  @column()
  public zip: string

  @column()
  public countryId: number

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @column.date()
  public startDate: DateTime

  @column.date()
  public endDate: DateTime

  @column()
  public desc: string

  @column()
  public isCurrent: boolean

  @column()
  public userProfileId: number
}
