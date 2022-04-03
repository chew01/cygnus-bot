import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SlashCommand } from '../../../types/command';
import { playerRank, playerSubcommand } from './player';

const rankCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ms')
    .setDescription('Accesses Maplestory rankings.')
    .addSubcommand(playerSubcommand),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'p') return playerRank(interaction);
    return interaction.reply({ content: 'Invalid subcommand!', ephemeral: true });
  },
};

export default rankCommand;
