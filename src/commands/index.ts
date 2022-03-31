import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { SlashCommand } from '../types/command';
import log from '../utils/logger';

export const commands = new Collection<string, SlashCommand>();
const devDirs = fs.readdirSync(path.resolve(__dirname, 'dev/'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.resolve(__dirname, `dev/${dirent.name}/index.js`));
const globalDirs = fs.readdirSync(path.resolve(__dirname, 'general/'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.resolve(__dirname, `general/${dirent.name}/index.js`));

export async function setUpCommandCollections() {
  log.info('[INITIALIZING] Setting up commands...');
  await globalDirs.forEach((commandFile) => {
    import(`${commandFile}`).then((command) => {
      commands.set(command.default.data.name, command.default);
    });
  });
  await devDirs.forEach((commandFile) => {
    import(`${commandFile}`).then((command) => {
      commands.set(command.default.data.name, { ...command.default, devOnly: true });
    });
  });
  log.info('[INITIALIZING] Commands set up successfully.');
}
