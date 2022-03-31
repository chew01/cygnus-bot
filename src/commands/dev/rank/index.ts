import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SlashCommand } from '../../../types/command';
import { playerRank, playerSubcommand } from './player';
import { worldLeaderboard, worldSubcommand } from './world';
import { jobLeaderboard, jobSubcommand } from './job';

const rankCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ms')
    .setDescription('Accesses Maplestory rankings.')
    .addSubcommand(playerSubcommand)
    .addSubcommand(worldSubcommand)
    .addSubcommand(jobSubcommand),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'p') return playerRank(interaction);
    if (subcommand === 'w') return worldLeaderboard(interaction);
    if (subcommand === 'j') return jobLeaderboard(interaction);
    return interaction.reply({ content: 'Invalid subcommand!', ephemeral: true });
  },
};

export default rankCommand;
