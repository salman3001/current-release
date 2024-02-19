import Factory from '@ioc:Adonis/Lucid/Factory'
import Street from 'App/Models/address/Street'

export default Factory.define(Street, ({ faker }) => {
  return {
    name: faker.location.street(),
  }
}).build()
