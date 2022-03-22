import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { BOT_ID, DEV_GUILD_ID, DISCORD_TOKEN } from '../config';
import { commands } from '../commands';
import log from './logger';

/**
 * Upsert all commands tagged as developer-only to the provided development guild.
 */
export async function updateDevCommands(): Promise<void> {
  if (!DEV_GUILD_ID) return;

  const devCommandsParsed: unknown[] = [];
  commands.filter((command) => command.devOnly === true).forEach((command) => {
    devCommandsParsed.push(command.data.toJSON());
  });

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(
      BOT_ID.toString(),
      DEV_GUILD_ID.toString(),
    ),
    { body: devCommandsParsed },
  )
    .then(() => log.info('[DEV MODE] Slash commands successfully updated.'))
    .catch(log.error);
}

/**
 * Upsert all commands tagged as global throughout all guilds. This may take up to an hour.
 */
export async function updateGlobalCommands(): Promise<void> {
  throw new Error('Not implemented yet!');
}
