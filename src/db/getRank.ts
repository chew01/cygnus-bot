import pool from './index';
import { RankingData } from '../types/rank';

export async function getCharRank(character: string): Promise<RankingData> {
  const client = await pool.connect();
  const query = 'SELECT * FROM ranking WHERE LOWER(charactername) = LOWER($1)';
  const characterEncoded = encodeURIComponent(character);
  try {
    const res = await client.query(query, [characterEncoded]);
    return res.rows[0];
  } finally {
    client.release();
  }
}

export default getCharRank;
