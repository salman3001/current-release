import Factory from '@ioc:Adonis/Lucid/Factory'
import StreetFactory from './StreetFactory'
import City from 'App/Models/address/City'

export default Factory.define(City, ({ faker }) => {
  return {
    name: faker.location.city(),
  }
})
  .relation('street', () => StreetFactory)
  .build()
