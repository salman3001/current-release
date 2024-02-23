import ServiceVariant from 'App/Models/service/ServiceVariant'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(ServiceVariant, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    availableQty: faker.number.int({ min: 1, max: 20 }),
    price: faker.number.int({ min: 20, max: 100 }),
    excluded: JSON.parse(faker.datatype.json()),
    included: JSON.parse(faker.datatype.json()),
    flatDiscount: 0,
    hasInifiiteQty: false,
    features: JSON.parse(faker.datatype.json()),
    // aditionalProperties: [
    //   { color: 'pink', size: '32' },
    //   { color: 'black', size: '34' },
    // ],
  }
}).build()
