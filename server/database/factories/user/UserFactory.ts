import User from 'App/Models/user/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import AddressFactory from '../address/AddressFactory'
import EducationFactory from './EducationFactory'
import ExperienceFactory from './ExperienceFactory'
import LanguageFactory from '../LanguageFactory'
import SkillFactory from './SkillFactory'
import NotificationSettingFactory from './NotificationSettingFactory'
import SocialFactory from '../SocialFactory'
import FavoriteLinkFactory from '../FavoriteLinkFactory'
import ProductFactory from '../product/ProductFactory'

export default Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    isActive: false,
    isPublic: true,
    password: '123456789',
    phone: '9999999999',
    userName: faker.internet.userName(),
    desc: faker.lorem.sentence(20),
  }
})
  .relation('address', () => AddressFactory)
  .relation('educations', () => EducationFactory)
  .relation('experiences', () => ExperienceFactory)
  .relation('languages', () => LanguageFactory)
  .relation('skills', () => SkillFactory)
  .relation('NotificationSetting', () => NotificationSettingFactory)
  .relation('social', () => SocialFactory)
  .relation('favoriteLinks', () => FavoriteLinkFactory)
  .relation('products', () => ProductFactory)
  .build()
