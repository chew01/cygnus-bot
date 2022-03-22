import { Embed, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SlashCommand } from '../../types/command';
import bot from '../../index';
import { BOT_CREATED_AT, BOT_VERSION } from '../../config';
import { formatBytes } from '../../utils/math';

dayjs.extend(duration);

const infoCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Replies with bot statistics.'),
  async execute(interaction: CommandInteraction) {
    const usage = process.memoryUsage();
    const totalGuilds = bot.guilds.cache.size.toString();
    const totalChannels = bot.channels.cache.size.toString();
    const cachedUsers = bot.users.cache.size.toString();
    const nodeVersion = process.version;
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const djsVersion = require('../../../package.json').dependencies['discord.js'].replace('^', 'v');
    const botVersion = BOT_VERSION;
    const botAge = `<t:${Math.floor(BOT_CREATED_AT / 1000)}:R>`;
    const uptime = dayjs.duration(bot.uptime as number).format('D[d] H[h] m[m] s[s]');
    const usageStats = `**RSS**: ${formatBytes(usage.rss)}\n**Heap Total**: ${formatBytes(usage.heapTotal)}\n**Heap Used** ${formatBytes(usage.heapUsed)}`;

    const infoEmbed = new Embed().setAuthor({
      name: 'Cygnus Bot Statistics',
      iconURL: 'https://i.imgur.com/LNZkA9g.jpg',
    }).addFields(
      { name: 'Total Guilds', value: totalGuilds, inline: true },
      { name: 'Total Channels', value: totalChannels, inline: true },
      { name: 'Cached Members', value: cachedUsers, inline: true },
      { name: 'Node Version', value: nodeVersion, inline: true },
      { name: 'Discord.js Version', value: djsVersion, inline: true },
      { name: 'Bot Version', value: botVersion, inline: true },
      { name: 'Bot Age', value: botAge, inline: true },
      { name: 'Bot Uptime', value: uptime, inline: true },
      { name: 'Memory Usage', value: usageStats, inline: true },
    );

    await interaction.reply({ embeds: [infoEmbed] });
  },
};

export default infoCommand;
