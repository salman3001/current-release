import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'faqs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('quest')
      table.string('ans', 1000)
      table.bigInteger('order').defaultTo(1).notNullable()
      table
        .integer('service_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('service_subcategories')
        .onDelete('CASCADE')
      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .onDelete('CASCADE')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

      table
        .integer('service_tag_id')
        .unsigned()
        .references('id')
        .inTable('service_tags')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
