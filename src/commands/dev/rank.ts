import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from 'discord.js';
import { SlashCommand } from '../../types/command';
import { formatBigint, rankToEmoji, serverToEmoji } from '../../utils/helpers';
import { CDN_URL } from '../../config';
import {
  getCharRank,
  getJobLeaderboard,
  getJobLeaderboardPages,
  getWorldLeaderboard,
  getWorldLeaderboardPages,
  jobs,
} from '../../db/cache';

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

async function createWorldLeaderboard(world: string, page: number) {
  const data = getWorldLeaderboard(world, page);
  const fields = data.map((charData) => ({
    name: `${rankToEmoji(charData.worldrank)} ${charData.charactername} - Lv. ${charData.level} ${charData.jobname}`,
    value: `> Global Rank #${charData.overallrank} | ${charData.worldname} Rank #${charData.worldrank}
        > World Legion Rank #${charData.legionrank ?? 'Unavailable'}`,
  }));

  return new MessageEmbed()
    .setThumbnail('https://i.imgur.com/GC5JkFT.png')
    .setTitle(`Leaderboard - ${world} ${serverToEmoji(world)}`)
    .addFields(fields)
    .setFooter({
      text: `Page ${page + 1} / ${getWorldLeaderboardPages(world)}`,
    });
}

function createGalleryRow(page: number, pageCount: number, end?: boolean): MessageActionRow {
  const prevBtn = new MessageButton()
    .setCustomId('prevbtn')
    .setLabel('Previous')
    .setEmoji('◀️')
    .setStyle('PRIMARY');
  const nextBtn = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('Next')
    .setEmoji('▶️')
    .setStyle('PRIMARY');
  const timeOut = new MessageButton()
    .setCustomId('timeout')
    .setLabel('Command timed out.')
    .setEmoji('🕓')
    .setStyle('SECONDARY')
    .setDisabled(true);
  if (end) {
    return new MessageActionRow()
      .addComponents(timeOut);
  }
  if (page === 0 && page === pageCount - 1) {
    return new MessageActionRow()
      .addComponents(prevBtn.setDisabled(true), nextBtn.setDisabled(true));
  }
  if (page === 0) {
    return new MessageActionRow()
      .addComponents(prevBtn.setDisabled(true), nextBtn);
  }
  if (page === pageCount - 1) {
    return new MessageActionRow()
      .addComponents(prevBtn, nextBtn.setDisabled(true));
  }
  return new MessageActionRow()
    .addComponents(prevBtn, nextBtn);
}

// eslint-disable-next-line consistent-return
async function worldLeaderboard(interaction: CommandInteraction): Promise<void> {
  const world = interaction.options.getString('world');
  if (!world) return interaction.reply({ content: 'No world was specified!', ephemeral: true });

  let page = 0;
  const pageCount = getWorldLeaderboardPages(world);
  const worldEmbed = await createWorldLeaderboard(world, page);

  if (!interaction.deferred) await interaction.deferReply();
  const curPage = await interaction.editReply({
    embeds: [worldEmbed],
    components: [createGalleryRow(page, pageCount)],
  }) as Message;

  const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id
        && (i.customId === 'prevbtn' || i.customId === 'nextbtn');
  const collector = curPage.createMessageComponentCollector({ filter, time: 30000 });

  collector.on('collect', async (i) => {
    switch (i.customId) {
      case 'prevbtn':
        if (page === 0) break;
        page -= 1;
        break;
      case 'nextbtn':
        if (page === pageCount - 1) break;
        page += 1;
        break;
      default:
        break;
    }
    const newWorldEmbed = await createWorldLeaderboard(world, page);

    await i.update({
      embeds: [newWorldEmbed],
      components: [createGalleryRow(page, pageCount)],
    });

    collector.resetTimer();
  });

  collector.on('end', (_, reason) => {
    if (reason === 'time') {
      interaction.webhook.editMessage('@original', {
        components: [createGalleryRow(page, pageCount, true)],
      });
    }
  });
}

async function createJobLeaderboard(job: string, page: number, world?: string) {
  const data = getJobLeaderboard(job, page, world);
  const fields = data.map((charData) => ({
    name: `${charData.index ? rankToEmoji(charData.index) : ''} ${charData.charactername} - Lv. ${charData.level} ${charData.jobname}`,
    value: `> Global Rank #${charData.overallrank} | ${charData.worldname} Rank #${charData.worldrank}
        > World Legion Rank #${charData.legionrank ?? 'Unavailable'}`,
  }));

  return new MessageEmbed()
    .setThumbnail('https://i.imgur.com/GC5JkFT.png')
    .setTitle(`Leaderboard - ${job}${world ? ` in ${world} ${serverToEmoji(world)}` : ''}`)
    .addFields(fields)
    .setFooter({
      text: `Page ${page + 1} / ${getJobLeaderboardPages(job, world)}`,
    });
}

// eslint-disable-next-line consistent-return
async function jobLeaderboard(interaction: CommandInteraction): Promise<void> {
  const jobinput = interaction.options.getString('job');
  const world = interaction.options.getString('world') ?? undefined;
  const job = jobs.find((jobName) => jobName.toLowerCase() === jobinput);
  if (!job) {
    return interaction.reply({ content: 'Job does not exist!', ephemeral: true });
  }

  let page = 0;
  const pageCount = getJobLeaderboardPages(job);
  const jobEmbed = await createJobLeaderboard(job, page, world);

  if (!interaction.deferred) await interaction.deferReply();
  const curPage = await interaction.editReply({
    embeds: [jobEmbed],
    components: [createGalleryRow(page, pageCount)],
  }) as Message;

  const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id
        && (i.customId === 'prevbtn' || i.customId === 'nextbtn');
  const collector = curPage.createMessageComponentCollector({ filter, time: 30000 });

  collector.on('collect', async (i) => {
    switch (i.customId) {
      case 'prevbtn':
        if (page === 0) break;
        page -= 1;
        break;
      case 'nextbtn':
        if (page === pageCount - 1) break;
        page += 1;
        break;
      default:
        break;
    }
    const newJobEmbed = await createJobLeaderboard(job, page, world);

    await i.update({
      embeds: [newJobEmbed],
      components: [createGalleryRow(page, pageCount)],
    });

    collector.resetTimer();
  });

  collector.on('end', (_, reason) => {
    if (reason === 'time') {
      interaction.webhook.editMessage('@original', {
        components: [createGalleryRow(page, pageCount, true)],
      });
    }
  });
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
      .setDescription('Finds the ranking data for a Maplestory job.')
      .addStringOption((option) => option
        .setName('job')
        .setDescription('The Maplestory job to find rankings for.')
        .setRequired(true))
      .addStringOption((option) => option
        .setName('world')
        .setDescription('The Maplestory world to find job rankings for.')
        .addChoice('Scania', 'Scania')
        .addChoice('Bera', 'Bera')
        .addChoice('Aurora', 'Aurora')
        .addChoice('Elysium', 'Elysium')
        .addChoice('Reboot (NA)', 'Reboot (NA)'))),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'p') return playerRank(interaction);
    if (subcommand === 'w') return worldLeaderboard(interaction);
    if (subcommand === 'j') return jobLeaderboard(interaction);
    return interaction.reply({ content: 'Invalid subcommand!', ephemeral: true });
  },
};

export default rankCommand;
