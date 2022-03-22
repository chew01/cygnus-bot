import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SlashCommand } from '../../types/command';

const testCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!');
  },
};

export default testCommand;
