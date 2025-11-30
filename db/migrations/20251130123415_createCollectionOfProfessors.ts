import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('professors', table => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('photo')
    table.integer('score').checkBetween([0, 5])
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('professors')
}

