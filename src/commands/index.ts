import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { SlashCommand } from '../types/command';

export const globalCommands = new Collection<string, SlashCommand>();
const globalCommandPaths = fs.readdirSync(path.resolve(__dirname, 'general/')).filter((filename) => filename.endsWith('.js'));

export const devCommands = new Collection<string, SlashCommand>();
const devCommandPaths = fs.readdirSync(path.resolve(__dirname, 'dev/')).filter((filename) => filename.endsWith('.js'));

export const commands = new Collection<string, SlashCommand>();

export async function setUpCommandCollections() {
  await globalCommandPaths.forEach((commandFile) => {
    import(`./general/${commandFile}`).then((command) => {
      globalCommands.set(command.default.data.name, command.default);
    });
  });
  await devCommandPaths.forEach((commandFile) => {
    import(`./dev/${commandFile}`).then((command) => {
      devCommands.set(command.default.data.name, command.default);
    });
  });
  await globalCommands.forEach((value, key) => commands.set(key, value));
  await devCommands.forEach((value, key) => commands.set(key, value));
}
