import ServiceSubcategory from 'App/Models/service/ServiceSubcategory'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import SeoFactory from '../SeoFactory'
import ServiceCategoryFactory from './ServiceCategoryFactory'
import ServiceFactory from './ServiceFactory'

export default Factory.define(ServiceSubcategory, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    shortDesc: faker.lorem.paragraph(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
  }
})
  .relation('faqs', () => FaqFactory)
  .relation('seo', () => SeoFactory)
  .relation('serviceCategory', ServiceCategoryFactory)
  .relation('Services', () => ServiceFactory)
  .build()
