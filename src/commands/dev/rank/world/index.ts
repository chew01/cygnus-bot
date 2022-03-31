import {
  CommandInteraction, Message, MessageComponentInteraction, MessageEmbed,
} from 'discord.js';
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { getWorldLeaderboard, getWorldLeaderboardPages } from '../../../../db/cache';
import { rankToEmoji, serverToEmoji } from '../../../../utils/helpers';
import createGalleryRow from '../constructors';

export async function createWorldLeaderboard(world: string, page: number) {
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

// eslint-disable-next-line consistent-return
export async function worldLeaderboard(interaction: CommandInteraction): Promise<void> {
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

export const worldSubcommand = new SlashCommandSubcommandBuilder()
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
    .addChoice('Reboot (NA)', 'Reboot (NA)'));
