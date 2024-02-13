import ProductCategory from 'App/Models/product/ProductCategory'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import SeoFactory from '../SeoFactory'
import ProductFactory from './ProductFactory'
import ProductSubcategoryFactory from './ProductSubcategoryFactory'

export default Factory.define(ProductCategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('seo', () => SeoFactory)
  .relation('products', () => ProductFactory)
  .relation('subCategory', () => ProductSubcategoryFactory)
  .build()
