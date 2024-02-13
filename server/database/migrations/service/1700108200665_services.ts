import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { ServiceLocationType } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email')
      table.string('phone')
      table.string('short_desc')
      table.text('long_desc')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('company_name')
      table.boolean('status').defaultTo(false).notNullable()
      table.boolean('specific_location').defaultTo(false).notNullable()
      table.json('logo')
      table.json('cover')
      table.json('video')
      table.json('brocher')
      table
        .enum('location_type', Object.values(ServiceLocationType))
        .defaultTo('Physical')
        .notNullable()
      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .onDelete('SET NULL')
      table
        .integer('service_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('service_subcategories')
        .onDelete('SET NULL')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
