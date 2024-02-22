import VenderUser from 'App/Models/venderUser/VenderUser'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BusinessFactory from './BusinessFactory'
import UserProfileFactory from '../UserProfileFactory'

export default Factory.define(VenderUser, ({ faker }) => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: '123456789',
    email: faker.internet.email(),
    phone: faker.number.int({ max: 999999999, min: 111111111 }).toString(),
    isActive: false,
  }
})
  .relation('business', () => BusinessFactory)
  .relation('profile', () => UserProfileFactory)
  .build()
