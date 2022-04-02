/* eslint-disable prefer-destructuring */
import dotenv from 'dotenv';
import { IntentsString } from 'discord.js';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DISCORD_TOKEN) throw new Error('No bot token was provided.');
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const BOT_ID = BigInt(Buffer.from(DISCORD_TOKEN.split('.')[0], 'base64').toString());

/**
 * Whether the bot is in development mode. If true, dev commands will be updated on the dev server.
 * @default true
 */
export const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE ?? true;
export const DEV_GUILD_ID = process.env.DEV_GUILD_ID ? BigInt(process.env.DEV_GUILD_ID) : 0n;

if (!process.env.CHARACTER_ENDPOINT) throw new Error('Character API endpoint was not provided.');
if (!process.env.POPULATION_ENDPOINT) throw new Error('Population API endpoint was not provided.');
if (!process.env.CDN_URL) throw new Error('CDN URL was not provided.');
export const CHARACTER_ENDPOINT = process.env.CHARACTER_ENDPOINT;
export const POPULATION_ENDPOINT = process.env.POPULATION_ENDPOINT;
export const CDN_URL = process.env.CDN_URL;

export const GATEWAY_INTENTS: IntentsString[] = [
  'GUILDS',
  'DIRECT_MESSAGES',
  'GUILD_MESSAGES',
];

export const BOT_VERSION = 'v1.0.0';
// eslint-disable-next-line no-bitwise
export const BOT_CREATED_AT = Number(BOT_ID >> 22n) + 1420070400000;
