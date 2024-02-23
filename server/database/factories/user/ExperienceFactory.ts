import Experience from 'App/Models/user/Experience'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'
import JobDepartmentFactory from './JobDepartmentFactory'
import JobIndustryFactory from './JobIndustryFactory'

export default Factory.define(Experience, ({ faker }) => {
  return {
    jobFunction: faker.lorem.word(),
    jobTitle: faker.company.name(),
    companyName: faker.company.name(),
    companySize: faker.lorem.word(),
    isCurrent: true,
    desc: faker.lorem.sentence(),
    startDate: DateTime.now(),
    endDate: DateTime.now(),
  }
})
  .relation('department', () => JobDepartmentFactory)
  .relation('industry', () => JobIndustryFactory)
  .build()
