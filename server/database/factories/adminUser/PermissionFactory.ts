import Permission from 'App/Models/adminUser/Permission'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Permission, ({ faker }) => {
  return {
    name: faker.lorem.word(),
  }
}).build()
