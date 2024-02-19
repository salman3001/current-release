import Service from 'App/Models/service/Service'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ServiceCategoryFactory from './ServiceCategoryFactory'
import ServiceSubcategoryFactory from './ServiceSubcategoryFactory'
import SeoFactory from '../SeoFactory'
import ServiceTagFactory from './ServiceTagFactory'
import SocialFactory from '../SocialFactory'
import UserFactory from '../user/UserFactory'
import ServiceVariantFactory from './ServiceVariantFactory'

export default Factory.define(Service, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
    specificLocation: false,
  }
})
  .relation('faq', () => FaqFactory)
  .relation('serviceCategory', () => ServiceCategoryFactory)
  .relation('serviceSubcategory', () => ServiceSubcategoryFactory)
  .relation('seo', () => SeoFactory)
  .relation('social', () => SocialFactory)
  .relation('tags', () => ServiceTagFactory)
  .relation('user', () => UserFactory)
  .relation('variants', () => ServiceVariantFactory)
  .build()
