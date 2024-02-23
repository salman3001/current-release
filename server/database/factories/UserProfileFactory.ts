import UserProfile from 'App/Models/UserProfile'
import Factory from '@ioc:Adonis/Lucid/Factory'
import EducationFactory from './user/EducationFactory'
import ExperienceFactory from './user/ExperienceFactory'
import LanguageFactory from './LanguageFactory'
import SkillFactory from './user/SkillFactory'
import SocialFactory from './SocialFactory'
import FavoriteLinkFactory from './FavoriteLinkFactory'

export default Factory.define(UserProfile, ({ faker }) => {
  return {}
})
  .relation('educations', () => EducationFactory)
  .relation('experiences', () => ExperienceFactory)
  .relation('languages', () => LanguageFactory)
  .relation('skills', () => SkillFactory)
  .relation('social', () => SocialFactory)
  .relation('favoriteLinks', () => FavoriteLinkFactory)
  .build()
