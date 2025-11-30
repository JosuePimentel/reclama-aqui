import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('comments', table => {
    table.uuid('id').primary()
    table.uuid('user_id')
    table.uuid('professor_id')
    table.string('comment').checkLength('<=', 500).notNullable()
    table.integer('score').checkBetween([0, 5]).notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('comments')
}

