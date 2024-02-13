import Education from 'App/Models/user/Education'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

export default Factory.define(Education, ({ faker }) => {
  return {
    field: faker.word.words(),
    institute: faker.location.city(),
    degree: faker.lorem.word(),
    desc: faker.lorem.sentence(),
    start_date: DateTime.now(),
    end_date: DateTime.now(),
  }
}).build()
