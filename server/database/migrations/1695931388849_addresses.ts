import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('address')
      table
        .integer('admin_user_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('admin_users')
        .onDelete('CASCADE')

      table
        .integer('user_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('service_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

      table
        .integer('continent_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('continents')
        .onDelete('SET NULL')

      table
        .integer('country_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('countries')
        .onDelete('SET NULL')

      table
        .integer('state_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('states')
        .onDelete('SET NULL')

      table
        .integer('city_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('cities')
        .onDelete('SET NULL')

      table
        .integer('street_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('streets')
        .onDelete('SET NULL')

      table.string('zip', 10)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
