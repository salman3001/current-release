import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'experiences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('job_industry_id', 50)
        .unsigned()
        .references('id')
        .inTable('job_industries')
        .onDelete('SET NULL')
      table.string('job_function', 50)
      table.string('job_title', 50)
      table
        .integer('job_department_id', 50)
        .unsigned()
        .references('id')
        .inTable('job_departments')
        .onDelete('SET NULL')
      table.string('company_name', 50)
      table.string('company_size', 50)
      table
        .integer('city_id', 10)
        .unsigned()
        .references('id')
        .inTable('cities')
        .onDelete('SET NULL')
      table
        .integer('state_id', 10)
        .unsigned()
        .references('id')
        .inTable('states')
        .onDelete('SET NULL')
      table.string('zip', 50)
      table
        .integer('country_id', 50)
        .unsigned()
        .references('id')
        .inTable('countries')
        .onDelete('SET NULL')
      table.date('start_date')
      table.date('end_date')
      table.text('desc')
      table.boolean('is_current').defaultTo(false)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
