import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed,
} from 'discord.js';
import { SlashCommand } from '../../types/command';
import { getCharRank, getWorldRank } from '../../db/getRank';
import { formatBigint, rankToEmoji, serverToEmoji } from '../../utils/helpers';
import { CDN_URL } from '../../config';
import { RankingData } from '../../types/rank';
import log from '../../utils/logger';

type rankingType = 'overallrank' | 'worldrank'

async function playerRank(interaction: CommandInteraction): Promise<void> {
  const character = interaction.options.getString('character');
  if (!character) return interaction.reply({ content: 'No character was specified!', ephemeral: true });
  const data = await getCharRank(character);
  if (!data) return interaction.reply({ content: 'Character does not exist!', ephemeral: true });

  const charEmbed = new MessageEmbed()
    .setThumbnail(`${CDN_URL}${data.characterimgurl.substring(38)}`)
    .setTitle(`${data.charactername} - ${data.worldname}`)
    .addFields(
      { name: 'Name', value: data.charactername, inline: true },
      { name: 'Class', value: data.jobname, inline: true },
      { name: 'Server', value: data.worldname, inline: true },
      { name: 'Level', value: `${data.level}`, inline: true },
      { name: 'EXP', value: formatBigint(data.exp), inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'Overall Rank', value: `${data.overallrank}`, inline: true },
      { name: 'World Rank', value: `${data.worldrank}`, inline: true },
      { name: 'World Legion Rank', value: `${data.legionrank ?? 'Unavailable'}`, inline: true },
      { name: 'Legion Level', value: `${data.legionlevel ?? 'Unavailable'}`, inline: true },
      {
        name: 'Legion Power',
        value: `${data.raidpower ? formatBigint(data.raidpower) : 'Unavailable'}`,
        inline: true,
      },
      { name: '\u200B', value: '\u200B', inline: true },
    );
  return interaction.reply({ embeds: [charEmbed] });
}

async function createLeaderboard(
  data: RankingData[],
  ranking: rankingType,
  thumbnail: string,
  title: string,
) {
  const fields = data.map((charData) => ({
    name: `${rankToEmoji(charData[ranking])} ${charData.charactername} - Lv. ${charData.level} ${charData.jobname}`,
    value: `> Global Rank #${charData.overallrank} | World Rank #${charData.worldrank}
        > World Legion Rank #${charData.legionrank ?? 'Unavailable'}`,
  }));

  return new MessageEmbed()
    .setThumbnail(thumbnail)
    .setTitle(title)
    .addFields(fields);
}

async function worldLeaderboard(interaction: CommandInteraction): Promise<void> {
  const world = interaction.options.getString('world');
  if (!world) return interaction.reply({ content: 'No world was specified!', ephemeral: true });
  const data = await getWorldRank(world);
  if (!data) return interaction.reply({ content: 'World does not exist!', ephemeral: true });

  const worldEmbed = await createLeaderboard(
    data,
    'worldrank',
    'https://i.imgur.com/GC5JkFT.png',
    `Leaderboard - ${world} ${serverToEmoji(world)}`,
  );
  const prevBtn = new MessageButton()
    .setCustomId('prevbtn')
    .setLabel('Previous')
    .setEmoji('arrow_backward')
    .setStyle('PRIMARY');
  const nextBtn = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('Next')
    .setEmoji('arrow_forward')
    .setStyle('PRIMARY');
  const gallery = new MessageActionRow()
    .addComponents(prevBtn, nextBtn);

  if (!interaction.deferred) await interaction.deferReply();
  const curPage = await interaction.editReply({
    embeds: [worldEmbed],
    components: [gallery],
  }) as Message;

  const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id
        && (i.customId === 'prevbtn' || i.customId === 'nextbtn');
  const collector = curPage.createMessageComponentCollector({ filter, time: 30000 });

  collector.on('collect', async (i) => {
    log.info(i.user.id);
  });
  return log.info('placeholder');
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
      .setDescription('Finds the ranking data for a Maplestory world.')
      .addStringOption((option) => option
        .setName('world')
        .setDescription('The Maplestory world to find rankings for.')
        .setRequired(true)
        .addChoice('Scania', 'Scania')
        .addChoice('Bera', 'Bera')
        .addChoice('Aurora', 'Aurora')
        .addChoice('Elysium', 'Elysium')
        .addChoice('Reboot (NA)', 'Reboot (NA)')))
    .addSubcommand((subcommand) => subcommand
      .setName('j')
      .setDescription('Finds the ranking data for a Maplestory job.')),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'p') return playerRank(interaction);
    if (subcommand === 'w') return worldLeaderboard(interaction);
    return interaction.reply({ content: 'Invalid subcommand!', ephemeral: true });
  },
};

export default rankCommand;
