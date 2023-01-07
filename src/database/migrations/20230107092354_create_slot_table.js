/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable('slot', (table) => {
    table.increments('id').primary();
    table.foreign('parkingLotId').references('id').inTable('parkingLot');
    table.boolean('isAvailable').defaultTo(true);
    table.integer('position').notNullable();

    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable('slot');
};

const t = carSi