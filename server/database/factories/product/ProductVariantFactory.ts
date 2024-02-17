import ProductVariant from 'App/Models/product/ProductVariant'
import Factory from '@ioc:Adonis/Lucid/Factory'
import ProductPropertyFactory from './ProductPropertyFactory'

export default Factory.define(ProductVariant, ({ faker }) => {
  return {
    availableQty: faker.number.int({ min: 1, max: 20 }),
    price: faker.number.int({ min: 20, max: 100 }),
  }
}).relation('properties', () => ProductPropertyFactory)
  .build()
