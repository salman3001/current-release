import Experience from 'App/Models/user/Experience'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'
import CityFactory from '../address/CityFactory'
import CountryFactory from '../address/CountryFactory'
import JobDepartmentFactory from './JobDepartmentFactory'
import JobIndustryFactory from './JobIndustryFactory'
import StateFactory from '../address/StateFactory'

export default Factory.define(Experience, ({ faker }) => {
  return {
    jobFunction: faker.lorem.word(),
    jobTitle: faker.company.name(),
    companyName: faker.company.name(),
    countryId: faker.number.int({ min: 1, max: 2 }),
    cityId: faker.number.int({ min: 1, max: 5 }),
    stateId: faker.number.int({ min: 1, max: 3 }),
    companySize: faker.lorem.word(),
    isCurrent: true,
    desc: faker.lorem.sentence(),
    startDate: DateTime.now(),
    endDate: DateTime.now(),
    zip: faker.number.int({ min: 1000, max: 9999 }).toString(),
  }
})
  .relation('city', () => CityFactory)
  .relation('state', () => StateFactory)
  .relation('country', () => CountryFactory)
  .relation('department', () => JobDepartmentFactory)
  .relation('industry', () => JobIndustryFactory)
  .build()
