import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../types/command';
import { getCharRank } from '../../db/getRank';
import { formatBigint } from '../../utils/math';
import { CDN_URL } from '../../config';

async function playerRank(interaction: CommandInteraction): Promise<void> {
  const character = interaction.options.getString('character');
  if (!character) return interaction.reply({ content: 'No character was specified!', ephemeral: true });
  const data = await getCharRank(character);
  const charEmbed = new MessageEmbed()
    .setAuthor({ name: 'Profile Data', iconURL: 'https://i.imgur.com/LNZkA9g.jpg' })
    .setThumbnail(`${CDN_URL}${data.characterimgurl.substring(38)}`)
    .addFields(
      { name: 'Name', value: data.charactername, inline: true },
      { name: 'Class', value: data.jobname, inline: true },
      { name: 'Server', value: data.worldname, inline: true },
      { name: 'Level', value: `${data.level}`, inline: true },
      { name: 'EXP', value: formatBigint(data.exp), inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'Overall Rank', value: `${data.overallrank}`, inline: true },
      { name: `${data.worldname} Rank`, value: `${data.worldrank}`, inline: true },
      { name: 'Legion Rank', value: `${data.legionrank ?? 'Unavailable'}`, inline: true },
      { name: 'Legion Level', value: `${data.legionlevel ?? 'Unavailable'}`, inline: true },
      {
        name: 'Legion Power',
        value: `${data.raidpower ? formatBigint(data.raidpower) : 'Unavailable'}`,
        inline: true,
      },
    );
  return interaction.reply({ embeds: [charEmbed] });
}

const rankCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ms')
    .setDescription('Accesses Maplestory rankings.')
    .addSubcommand((subcommand) => subcommand
      .setName('p')
      .setDescription('Finds the ranking data of a specific Maplestory character.')
      .addStringOption((option) => option
        .setName('character')
        .setDescription('The Maplestory character to search for.')
        .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('w')
      .setDescription('Finds the ranking data for a Maplestory world.'))
    .addSubcommand((subcommand) => subcommand
      .setName('j')
      .setDescription('Finds the ranking data for a Maplestory job.')),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'p') {
      return playerRank(interaction);
    }
    return interaction.reply({ content: 'Invalid subcommand!', ephemeral: true });
  },
};

export default rankCommand;
