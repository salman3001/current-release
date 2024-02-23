import Business from 'App/Models/venderUser/Business'
import Factory from '@ioc:Adonis/Lucid/Factory'
import ServiceFactory from '../service/ServiceFactory'
import AddressFactory from '../address/AddressFactory'
import FaqFactory from '../FaqFactory'
import ReviewFactory from '../service/ReviewFactory'
import SocialFactory from '../SocialFactory'

export default Factory.define(Business, ({ faker }) => {
  return {
    name: faker.lorem.words(2),
    isActive: true,
    shortDesc: faker.lorem.sentence(),
    longDesc: faker.lorem.paragraph(),
  }
})
  .relation('addresses', () => AddressFactory)
  .relation('faq', () => FaqFactory)
  .relation('reviews', () => ReviewFactory)
  .relation('social', () => SocialFactory)
  .relation('services', () => ServiceFactory)
  .build()
