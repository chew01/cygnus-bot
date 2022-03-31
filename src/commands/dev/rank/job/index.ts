import {
  CommandInteraction, Message, MessageComponentInteraction, MessageEmbed,
} from 'discord.js';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { getJobLeaderboard, getJobLeaderboardPages, jobs } from '../../../../db/cache';
import { rankToEmoji, serverToEmoji } from '../../../../utils/helpers';
import createGalleryRow from '../constructors';

export async function createJobLeaderboard(job: string, page: number, world?: string) {
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
export async function jobLeaderboard(interaction: CommandInteraction): Promise<void> {
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

export const jobSubcommand = new SlashCommandSubcommandBuilder()
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
    .addChoice('Reboot (NA)', 'Reboot (NA)'));
