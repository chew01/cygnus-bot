import { Client, Interaction } from 'discord.js';
import { BotEventHandler } from '../../types/event';
import log, { logCommand } from '../../utils/logger';
import { commands } from '../../commands';

const interactionCreateEventHandler: BotEventHandler = {
  name: 'interactionCreate',
  once: false,
  async execute(bot: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) log.info('Interaction was created, but it was not a slash command.');
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
        await interaction.reply({
          content: 'Uh oh! We were unable to execute your command.',
          ephemeral: true,
        }).catch(log.error);
      }
    }
  },
};

export default interactionCreateEventHandler;
