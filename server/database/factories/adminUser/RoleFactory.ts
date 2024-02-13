import Role from 'App/Models/adminUser/Role'
import Factory from '@ioc:Adonis/Lucid/Factory'
import PermissionFactory from './PermissionFactory'

export default Factory.define(Role, ({ faker }) => {
  return {
    name: faker.lorem.word(),
  }
})
  .relation('permissions', () => PermissionFactory)
  .build()
