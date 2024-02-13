import Service from 'App/Models/service/Service'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ServiceCategoryFactory from './ServiceCategoryFactory'
import ServiceSubcategoryFactory from './ServiceSubcategoryFactory'
import SeoFactory from '../SeoFactory'
import ServiceTagFactory from './ServiceTagFactory'
import SocialFactory from '../SocialFactory'

export default Factory.define(Service, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('serviceCategory', () => ServiceCategoryFactory)
  .relation('serviceSubcategory', () => ServiceSubcategoryFactory)
  .relation('seo', () => SeoFactory)
  .relation('social', () => SocialFactory)
  .relation('tags', () => ServiceTagFactory)
  .build()
