import knex from 'knex';
import knexConfig from '../../knexfile';

module.exports = async () => {
  const dbConn = knex(knexConfig.test);
  const database = knexConfig.test.connection.database;

  try {
    await dbConn.raw(`DROP DATABASE IF EXISTS ${database}`);
    await dbConn.destroy();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
