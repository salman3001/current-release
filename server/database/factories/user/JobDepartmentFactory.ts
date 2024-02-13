import Factory from '@ioc:Adonis/Lucid/Factory'
import JobDepartment from 'App/Models/user/JobDepartment'

export default Factory.define(JobDepartment, ({ faker }) => {
  return {
    name: faker.company.name(),
  }
}).build()
