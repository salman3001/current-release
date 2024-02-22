import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'educations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('institute', 50)
      table.string('degree', 50)
      table.string('field', 50)
      table.date('start_date')
      table.date('end_date')
      table.text('desc')
      table.integer('user_profile_id').unsigned().references('id').inTable('user_profiles').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
