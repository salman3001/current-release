import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('phone')
      table.string('email')
      table.string('short_desc')
      table.text('long_desc')
      table.string('company_name')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('status').defaultTo(false).notNullable()
      table.boolean('specific_location').defaultTo(false).notNullable()
      table.json('logo')
      table.json('cover')
      table.json('video')
      table.json('brocher')
      table
        .integer('product_category_id')
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('SET NULL')
      table
        .integer('product_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('product_subcategories')
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
