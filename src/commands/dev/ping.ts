import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SlashCommand } from '../../types/command';

const pingCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction: CommandInteraction) {
    const lat = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! ${lat} ms`);
  },
};

export default pingCommand;
