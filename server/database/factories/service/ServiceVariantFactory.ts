import ServiceVariant from 'App/Models/service/ServiceVariant'
import Factory from '@ioc:Adonis/Lucid/Factory'
import ServicePropertyFactory from './ServicePropertyFactory'

export default Factory.define(ServiceVariant, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    availableQty: faker.number.int({ min: 1, max: 20 }),
    price: faker.number.int({ min: 20, max: 100 }),
    excluded: [],
    included: [],
    flatDiscount: 0,
    hasInifiiteQty: false,
  }
})
  .relation('aditionalProperties', () => ServicePropertyFactory)
  .build()
