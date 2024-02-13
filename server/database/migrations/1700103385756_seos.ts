import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'seos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('meta_title')
      table.string('meta_keywords')
      table.string('meta_desc')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('product_category_id')
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('CASCADE')
      table
        .integer('product_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('product_subcategories')
        .onDelete('CASCADE')

      table
        .integer('product_tag_id')
        .unsigned()
        .references('id')
        .inTable('product_tags')
        .onDelete('CASCADE')

      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .onDelete('CASCADE')
      table
        .integer('service_subcategory_id')
        .unsigned()
        .references('id')
        .inTable('service_subcategories')
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
