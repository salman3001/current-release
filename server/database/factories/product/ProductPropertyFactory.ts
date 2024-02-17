import ProductProperty from 'App/Models/product/ProductProperty'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(ProductProperty, ({ faker }) => {
  return {
    name: faker.word.sample(),
    value: faker.word.sample()
  }
}).build()
