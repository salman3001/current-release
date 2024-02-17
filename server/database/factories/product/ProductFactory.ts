import Product from 'App/Models/product/Product'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ProductCategoryFactory from './ProductCategoryFactory'
import ProductSubcategoryFactory from './ProductSubcategoryFactory'
import SeoFactory from '../SeoFactory'
import ProductTagFactory from './ProductTagFactory'
import SocialFactory from '../SocialFactory'
import UserFactory from '../user/UserFactory'
import ProductVariantFactory from './ProductVariantFactory'
import { ProductType } from 'App/Helpers/enums'

export default Factory.define(Product, ({ faker }) => {
  return {
    type: faker.helpers.enumValue(ProductType),
    name: faker.commerce.productName(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
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
  .relation('user', () => UserFactory)
  .relation('variants', () => ProductVariantFactory)
  .build()
