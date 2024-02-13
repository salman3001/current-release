import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.json('file')

      table.integer('blog_id').unsigned().references('id').inTable('blogs').onDelete('SET NULL')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('SET NULL')

      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('SET NULL')

      table.integer('media_id').unsigned().references('id').inTable('media').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
