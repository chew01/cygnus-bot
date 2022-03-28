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

if (!process.env.DB_HOSTNAME) throw new Error('Database hostname was not specified!');
if (!process.env.DB_NAME) throw new Error('Database name was not specified!');
if (!process.env.DB_USERNAME) throw new Error('Database username was not specified!');
if (!process.env.DB_PASSWORD) throw new Error('Database password was not specified!');
export const DB_HOSTNAME = process.env.DB_HOSTNAME;
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = Number(process.env.DB_PORT) ?? 5432;
export const DB_MAX_CLIENTS = Number(process.env.DB_MAX_CLIENTS) ?? 5;

export const GATEWAY_INTENTS: IntentsString[] = [
  'DIRECT_MESSAGES',
  'GUILD_MESSAGES',
];

export const BOT_VERSION = 'v1.0.0';
// eslint-disable-next-line no-bitwise
export const BOT_CREATED_AT = Number(BOT_ID >> 22n) + 1420070400000;

export const CDN_URL = process.env.CDN_URL;
