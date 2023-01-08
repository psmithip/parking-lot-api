import knex from 'knex';
import knexConfig from '../../knexfile';
import { config } from '../config';

export const dbConn = knex(knexConfig[config.env]);
