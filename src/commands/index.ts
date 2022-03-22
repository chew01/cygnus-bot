import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { SlashCommand } from '../types/command';
import log from '../utils/logger';

export const commands = new Collection<string, SlashCommand>();
const globalCommandPaths = fs.readdirSync(path.resolve(__dirname, 'general/')).filter((filename) => filename.endsWith('.js'));
const devCommandPaths = fs.readdirSync(path.resolve(__dirname, 'dev/')).filter((filename) => filename.endsWith('.js'));

export async function setUpCommandCollections() {
  log.info('[INITIALIZING] Setting up commands...');
  await globalCommandPaths.forEach((commandFile) => {
    import(`./general/${commandFile}`).then((command) => {
      commands.set(command.default.data.name, command.default);
    });
  });
  await devCommandPaths.forEach((commandFile) => {
    import(`./dev/${commandFile}`).then((command) => {
      commands.set(command.default.data.name, { ...command.default, devOnly: true });
    });
  });
  log.info('[INITIALIZING] Commands set up successfully.');
}
