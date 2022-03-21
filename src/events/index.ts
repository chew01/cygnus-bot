import { Client, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { BotEventHandler } from '../types/event';
import log from '../utils/logger';

const events = new Collection<string, BotEventHandler>();
const eventPaths = fs.readdirSync(path.resolve(__dirname, 'eventHandlers/')).filter((filename) => filename.endsWith('.js'));
eventPaths.forEach((eventHandler) => {
  import(`./eventHandlers/${eventHandler}`)
    .then((event) => events.set(event.default.name, event.default));
});

export async function setUpEventHandlers(bot: Client) {
  log.info('[INITIALIZING] Setting up event handlers...');
  events.forEach((event) => {
    if (event.once) {
      bot.once(event.name, (...args) => event.execute(bot, ...args));
    } else {
      bot.on(event.name, (...args) => event.execute(bot, ...args));
    }
  });
  log.info('[INITIALIZING] Event handlers set up successfully.');
}

export default setUpEventHandlers;
