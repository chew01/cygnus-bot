import { Pool } from 'pg';
import log from '../utils/logger';
import {
  DB_HOSTNAME, DB_MAX_CLIENTS, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME,
} from '../config';

const pool = new Pool({
  user: DB_USERNAME,
  host: DB_HOSTNAME,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: DB_MAX_CLIENTS,
});

pool.on('error', (err) => {
  log.error('Unexpected error on idle client', err.message);
  process.exit(-1);
});

export default pool;
