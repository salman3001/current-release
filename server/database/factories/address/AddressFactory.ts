import Address from 'App/Models/address/Address'
import Factory from '@ioc:Adonis/Lucid/Factory'
import ContinentFactory from './ContinentFactory'
import StateFactory from './StateFactory'
import CityFactory from './CityFactory'
import StreetFactory from './StreetFactory'
import CountryFactory from './CountryFactory'

export default Factory.define(Address, ({ faker }) => {
  return {
    address: faker.lorem.lines(1),
    zip: '154ss',
  }
})
  .relation('continent', () => ContinentFactory)
  .relation('country', () => CountryFactory)
  .relation('state', () => StateFactory)
  .relation('city', () => CityFactory)
  .relation('street', () => StreetFactory)
  .build()
