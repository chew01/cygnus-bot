import pool from './index';
import log from '../utils/logger';
import { RankingData } from '../types/rank';

export const cache: RankingData[] = [];
export const jobs: string[] = [];

/** Populate cache with ranking data from the database. */
export async function populateCache() {
  const client = await pool.connect();
  try {
    log.info('[DB] Populating cache...');
    const resChars = await client.query('SELECT '
            + 'charactername,'
            + 'characterimgurl,'
            + 'level,'
            + 'exp,'
            + 'jobname,'
            + 'worldname,'
            + 'overallrank,'
            + 'legionlevel,'
            + 'raidpower,'
            + 'legionrank,'
            + 'worldrank '
            + 'FROM ranking');
    log.info(`[DB] Cache populated with ${resChars.rows.length} characters.`);
    cache.push(...resChars.rows);
    const resJobs = await client.query('SELECT DISTINCT jobname FROM ranking');
    log.info(`[DB] Cache populated with ${resJobs.rows.length} jobs.`);
    jobs.push(...resJobs.rows.map((job) => job.jobname));
  } finally {
    client.release();
  }
}

export function getCharRank(character: string): RankingData | undefined {
  return cache.find((charData) => charData.charactername.toLowerCase() === character.toLowerCase());
}

export function getWorldLeaderboard(world: string, page: number): RankingData[] {
  return cache.filter((charData) => charData.worldname === world).slice(page * 5, (page + 1) * 5);
}

export function getWorldLeaderboardPages(world: string) {
  const charCount = cache.filter((charData) => charData.worldname === world).length;
  return Math.ceil(charCount / 5);
}

export function getJobLeaderboard(job: string, page: number, world?: string): RankingData[] {
  if (!world) {
    return cache.filter((charData) => charData.jobname === job)
      .map((data, index) => ({ ...data, index: index + 1 })).slice(page * 5, (page + 1) * 5);
  }
  return cache.filter((charData) => charData.jobname === job && charData.worldname === world)
    .map((data, index) => ({ ...data, index: index + 1 })).slice(page * 5, (page + 1) * 5);
}

export function getJobLeaderboardPages(job: string, world?: string) {
  if (!world) {
    const charCount = cache.filter((charData) => charData.jobname === job).length;
    return Math.ceil(charCount / 5);
  }
  const charCount = cache.filter((charData) => charData.jobname === job
        && charData.worldname === world).length;
  return Math.ceil(charCount / 5);
}
