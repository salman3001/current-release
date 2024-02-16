import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { CartItemType } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('type', Object.values(CartItemType)).notNullable()
      table.integer('qty').notNullable()
      table.integer('cart_id').unsigned().references('id').inTable('carts').onDelete('CASCADE')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')

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
