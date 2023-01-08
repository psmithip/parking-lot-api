import knex from 'knex';
import knexConfig from '../../knexfile';

const createTestDatabase = async () => {
  const knexConfigWithoutDatabase = {
    ...knexConfig.test,
    connection: {
      ...knexConfig.test.connection,
      database: undefined,
    },
  };
  const database = knexConfig.test.connection.database;
  const dbConn = knex(knexConfigWithoutDatabase);

  try {
    await dbConn.raw(`DROP DATABASE IF EXISTS ${database}`);
    await dbConn.raw(`CREATE DATABASE ${database}`);
  } catch (error) {
    throw new Error(error);
  } finally {
    await dbConn.destroy();
  }
};

const migrateTestDatabase = async () => {
  const dbConn = knex(knexConfig.test);

  try {
    await dbConn.migrate.latest();
  } catch (error) {
    throw new Error(error);
  } finally {
    await dbConn.destroy();
  }
};

module.exports = async () => {
  try {
    await createTestDatabase();
    await migrateTestDatabase();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
