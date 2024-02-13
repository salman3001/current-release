import Product from 'App/Models/product/Product'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ProductCategoryFactory from './ProductCategoryFactory'
import ProductSubcategoryFactory from './ProductSubcategoryFactory'
import SeoFactory from '../SeoFactory'
import ProductTagFactory from './ProductTagFactory'
import SocialFactory from '../SocialFactory'

export default Factory.define(Product, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
    companyName: faker.company.name(),
    status: false,
    specificLocation: false,
  }
})
  .relation('faq', () => FaqFactory)
  .relation('productCategory', () => ProductCategoryFactory)
  .relation('productSubcategory', () => ProductSubcategoryFactory)
  .relation('seo', () => SeoFactory)
  .relation('social', () => SocialFactory)
  .relation('tags', () => ProductTagFactory)
  .build()
