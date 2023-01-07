import knex from 'knex';
import knexConfig from '../../knexfile';
import { config } from '../config';

export const conn = knex(knexConfig[config.env]);
