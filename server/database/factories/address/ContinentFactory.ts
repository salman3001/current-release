import Factory from '@ioc:Adonis/Lucid/Factory'
import CountryFactory from './CountryFactory'
import Continent from 'App/Models/address/Continent'

export default Factory.define(Continent, ({ faker }) => {
  return {
    name: faker.location.country(),
  }
})
  .relation('country', () => CountryFactory)
  .build()
