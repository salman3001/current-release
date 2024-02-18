import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_variants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 100).notNullable()
      table.decimal('price', 8, 2).notNullable()
      table.integer('available_qty').defaultTo(1)
      table.boolean('has_inifiite.qty').defaultTo(false)
      table.integer('flat_discount')
      table.json('features')
      table.json('included')
      table.json('excluded')
      table.bigInteger('order').notNullable()
      table.json('image')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
