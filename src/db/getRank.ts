import pool from './index';
import { RankingData } from '../types/rank';
import log from '../utils/logger';

export async function getCharRank(character: string): Promise<RankingData> {
  const client = await pool.connect();
  const query = 'SELECT * FROM ranking WHERE LOWER(charactername) = LOWER($1)';
  const characterEncoded = encodeURIComponent(character);
  try {
    log.info(`[DB] Query: Get character rank of ${character}`);
    const res = await client.query(query, [characterEncoded]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

export async function getWorldRank(world: string): Promise<RankingData[]> {
  const client = await pool.connect();
  const query = 'SELECT * FROM ranking WHERE worldname = $1 LIMIT 5';
  try {
    log.info(`[DB] Query: Get world rankings of ${world}`);
    const res = await client.query(query, [world]);
    return res.rows;
  } finally {
    client.release();
  }
}
