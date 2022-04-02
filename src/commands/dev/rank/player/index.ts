import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CDN_URL } from '../../../../config';
import { formatBigint } from '../../../../utils/helpers';
import getCharRank from './api';
import log from '../../../../utils/logger';

export async function playerRank(interaction: CommandInteraction) {
  if (!interaction.deferred) await interaction.deferReply();
  const character = interaction.options.getString('character');
  if (!character) return interaction.followUp({ content: 'No character was specified!', ephemeral: true });
  const data = await getCharRank(character);
  if (!data) return interaction.followUp({ content: 'Character does not exist!', ephemeral: true });

  const charEmbed = new MessageEmbed()
    .setThumbnail(`${CDN_URL}/${data.CharacterImageURL.substring(38)}`)
    .setTitle(`${data.Name} - ${data.Server}`)
    .setFooter({ text: `Last updated: ${data.ImportTime.toUTCString()}` })
    .addFields(
      { name: 'Name', value: data.Name, inline: true },
      { name: 'Class', value: data.Class, inline: true },
      { name: 'Server', value: data.Server, inline: true },
      { name: 'Level', value: `${data.Level}`, inline: true },
      { name: 'EXP', value: formatBigint(data.EXP), inline: true },
      { name: '% to Next Level', value: `${data.EXPPercent}%`, inline: true },
      { name: 'Average EXP (last 7 days)', value: `${formatBigint(data.WeekAverage)}`, inline: false },
      { name: 'Average EXP (last 14 days)', value: `${formatBigint(data.FortnightAverage)}`, inline: false },
      { name: 'Overall Rank', value: `${data.GlobalRanking}`, inline: true },
      { name: 'World Rank', value: `${data.ServerRank}`, inline: true },
      {
        name: 'World Legion Rank',
        value: `${data.LegionRank !== 0 ? data.LegionRank : 'Unavailable'}`,
        inline: true,
      },
      {
        name: 'Legion Level',
        value: `${data.LegionLevel !== 0 ? data.LegionLevel : 'Unavailable'}`,
        inline: true,
      },
      {
        name: 'Legion Power',
        value: `${data.LegionPower !== 0n ? formatBigint(data.LegionPower) : 'Unavailable'}`,
        inline: true,
      },
      { name: '\u200B', value: '\u200B', inline: true },
    );

  await interaction.editReply({ embeds: [charEmbed] });
  return log.debug('Player Rank fetched and distributed.');
}

export const playerSubcommand = new SlashCommandSubcommandBuilder()
  .setName('p')
  .setDescription('Finds the ranking data of a specific Maplestory character.')
  .addStringOption((option) => option
    .setName('character')
    .setDescription('The Maplestory character to search for.')
    .setRequired(true));
