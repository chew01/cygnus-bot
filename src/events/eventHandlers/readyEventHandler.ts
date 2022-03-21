import { Client } from 'discord.js';
import { BotEventHandler } from '../../types/event';
import log from '../../utils/logger';

const readyEventHandler: BotEventHandler = {
  name: 'ready',
  once: true,
  execute(bot: Client): void {
    if (!bot.user) return;
    log.info(`Ready! Logged in as ${bot.user.tag}`);
  },
};

export default readyEventHandler;
