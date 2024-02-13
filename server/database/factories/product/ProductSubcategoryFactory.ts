import ProductSubcategory from 'App/Models/product/ProductSubcategory'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ProductCategoryFactory from './ProductCategoryFactory'
import SeoFactory from '../SeoFactory'
import ProductFactory from './ProductFactory'

export default Factory.define(ProductSubcategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('productCategory', () => ProductCategoryFactory)
  .relation('products', () => ProductFactory)
  .relation('seo', () => SeoFactory)
  .build()
