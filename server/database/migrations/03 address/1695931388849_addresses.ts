import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('address')
      table.point('geo_location')
      table
        .integer('user_profile_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('user_profiles')
        .onDelete('CASCADE')

      table
        .integer('business_id', 10)
        .unsigned()
        .nullable()
        .references('id')
        .inTable('businesses')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
