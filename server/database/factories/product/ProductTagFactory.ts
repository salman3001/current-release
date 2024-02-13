import ProductTag from 'App/Models/product/ProductTag'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import SeoFactory from '../SeoFactory'

export default Factory.define(ProductTag, ({ faker }) => {
  return {
    name: faker.lorem.word(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('seo', () => SeoFactory)
  .build()
