import type { Client } from 'discord.js';
const logger = require('pino')().child({ module: 'DailyNoodle' });
import { Noodle, Provider, ScheduledNoodle } from './dailynoodle/schemas';
import init from './dailynoodle/init';
import { getNoodleEmbed, connectDB } from './dailynoodle/helpers';
import { CronJob } from 'cron';

export default async (client: Client) => {

    client.once('ready', async () => {

        await connectDB();
        await init();

        const sendNoods = new CronJob('0 * * * *', async () => {
            logger.info('Sending scheduled noodles...');
            const currentHour = new Date().getHours();
            const scheduledNoodles = await ScheduledNoodle.find({ hour: currentHour });
            scheduledNoodles.forEach(async (scheduledNoodle) => {
                if (!client.guilds.cache.has(scheduledNoodle.guild)) return;

                const guild = client.guilds.cache.get(scheduledNoodle.guild)!;
                const channel = guild.channels.cache.get(scheduledNoodle.channel);
                if (channel && channel.isTextBased()) {

                    await channel.send({ embeds: [await getNoodleEmbed(scheduledNoodle.noodle.name, client.user || undefined)] });
                }
            });
        }, null, true);
    });
};

export const getAvailableNoodles = async (): Promise<Noodle[]> => {
    const noodleIds = await Provider.distinct('mapping.noodle');
    const noodles = await Noodle.find({ _id: { $in: noodleIds } });
    return noodles;
}