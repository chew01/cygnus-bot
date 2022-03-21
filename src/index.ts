import { Client } from 'discord.js';
import {
  DISCORD_TOKEN, DEVELOPMENT_MODE, GATEWAY_INTENTS,
} from './config';
import { updateDevCommands, updateGlobalCommands } from './utils/commandUpdater';
import log from './utils/logger';
import { setUpEventHandlers } from './events';
import { setUpCommandCollections } from './commands';

(async () => {
  const bot = new Client({ intents: GATEWAY_INTENTS });

  // Add event listeners to bot client
  await setUpCommandCollections();
  await setUpEventHandlers(bot);

  if (DEVELOPMENT_MODE) {
    log.info('[DEV MODE] Updating slash commands for dev server.');
    await updateDevCommands();
  } else {
    log.info('[PROD MODE] Propagating commands globally. This may take up to an hour.');
    await updateGlobalCommands();
  }

  await bot.login(DISCORD_TOKEN);
})();
