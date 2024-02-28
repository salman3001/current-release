import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { BudgetType } from 'App/Helpers/enums'

export default class extends BaseSchema {
  protected tableName = 'service_requirements'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 50).notNullable()
      table.string('desc')
      table.json('skills_required')
      table.enum('budget_type', Object.values(BudgetType))
      table.decimal('budget', 10, 2).notNullable()
      table.dateTime('expires_at')
      table.point('location')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table
        .integer('service_category_id')
        .unsigned()
        .references('id')
        .inTable('service_categories')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('accepted_bid_id').unsigned()

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
