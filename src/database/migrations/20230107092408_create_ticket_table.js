/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable('ticket', (table) => {
    table.increments('id').primary();
    table.dateTime('entryAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('exitAt');
    table.string('plateNumber').notNullable();
    table.enum('carSize', ['SMALL', 'MEDIUM', 'LARGE']).notNullable();
    table.integer('slotId').unsigned();
    table.foreign('slotId').references('id').inTable('slot');

    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());

    table.index('carSize');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable('ticket');
};
