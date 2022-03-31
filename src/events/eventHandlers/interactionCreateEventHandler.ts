import { Client, Interaction } from 'discord.js';
import { BotEventHandler } from '../../types/event';
import log, { logCommand } from '../../utils/logger';
import { commands } from '../../commands';

const interactionCreateEventHandler: BotEventHandler = {
  name: 'interactionCreate',
  once: false,
  // eslint-disable-next-line consistent-return
  async execute(bot: Client, interaction: Interaction): Promise<void> {
    // Interaction is a slash command
    if (interaction.isCommand()) {
      const slashCommand = commands.get(interaction.commandName);
      // Slash command does not exist
      if (!slashCommand) {
        return interaction.reply({ content: 'Oops! Command does not exist!', ephemeral: true }).catch(log.error);
      }
      try {
        logCommand(interaction, 'Trigger', interaction.commandName);
        await slashCommand.execute(interaction);
        logCommand(interaction, 'Success', interaction.commandName);
      } catch (error) {
        logCommand(interaction, 'Failure', interaction.commandName);
        /*
                        await interaction.reply({
                          content: 'Uh oh! We were unable to execute your command.',
                          ephemeral: true,
                        });
                        */

        if (error instanceof Error) log.error(error.stack ? error.stack : error.message);
      }
    }
  },
};

export default interactionCreateEventHandler;
