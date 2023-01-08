require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      timezone: 'UTC',
      typeCast: (field, next) => {
        if (field.type === 'TINY' && field.length === 1) {
            return (field.string() == '1'); // 1 = true, 0 = false
        } 
        return next();
      }
    },
    migrations: {
      directory: 'src/database/migrations',
    },
  },
};
