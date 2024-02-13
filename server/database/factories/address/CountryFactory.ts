import Factory from '@ioc:Adonis/Lucid/Factory'
import StateFactory from './StateFactory'
import Country from 'App/Models/address/Country'

export default Factory.define(Country, ({ faker }) => {
  return {
    name: faker.location.country(),
  }
})
  .relation('state', () => StateFactory)
  .build()
