import Service from 'App/Models/service/Service'
import Factory from '@ioc:Adonis/Lucid/Factory'
import FaqFactory from '../FaqFactory'
import ServiceCategoryFactory from './ServiceCategoryFactory'
import ServiceSubcategoryFactory from './ServiceSubcategoryFactory'
import SeoFactory from '../SeoFactory'
import ServiceTagFactory from './ServiceTagFactory'
import ServiceVariantFactory from './ServiceVariantFactory'
import BusinessFactory from '../venderUser/BusinessFactory'

export default Factory.define(Service, ({ faker }) => {
  return {
    name: faker.commerce.productName(),
    shortDesc: faker.commerce.productDescription(),
    longDesc: faker.lorem.paragraphs(),
    status: false,
    locationSpecific: false,
    geoLocation: `${faker.location.longitude()},${faker.location.latitude()}`,
  }
})
  .relation('business', () => BusinessFactory)
  .relation('faq', () => FaqFactory)
  .relation('serviceCategory', () => ServiceCategoryFactory)
  .relation('serviceSubcategory', () => ServiceSubcategoryFactory)
  .relation('seo', () => SeoFactory)
  .relation('tags', () => ServiceTagFactory)
  .relation('variants', () => ServiceVariantFactory)
  .build()
