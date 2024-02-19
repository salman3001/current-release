import Factory from '@ioc:Adonis/Lucid/Factory'
import JobIndustry from 'App/Models/user/JobIndustry'

export default Factory.define(JobIndustry, ({ faker }) => {
  return {
    name: faker.company.name(),
  }
}).build()
