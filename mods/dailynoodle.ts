import * as mongoose from 'mongoose';
import type { Client, Guild, Embed, GuildMember, EmbedBuilder, User } from 'discord.js';
import { Noodle, NoodleStash, Provider, GuildSetup, ScheduledNoodle } from './dailynoodle/schemas';
import init from './dailynoodle/init';
import embed from './dailynoodle/embed';
import tinyfox from './dailynoodle/providers/tinyfox';
import { CronJob } from 'cron';

await init();

await mongoose.connect('mongodb://127.0.0.1:27017/dailynoodle');

export default async (client: Client) => {

    client.once('ready', async () => {

        const sendNoods = new CronJob('0 * * * *', async () => {
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

export const configureGuild = async (guild: Guild, channel: string, noodleNames: string[]): Promise<GuildSetup> => {
    const noodles = await Noodle.find({ name: { $in: noodleNames } });
    const setup = await GuildSetup.findOneAndUpdate({ guild: guild.id }, { guild: guild.id, channel, noodles }, { upsert: true, runValidators: true });
    return setup!;
}

export const getNoodleEmbed = async (noodleName: string, user?: User): Promise<EmbedBuilder> => {

    const noodle = await Noodle.findOne({ name: noodleName });
    const provider = await Provider.findOne({ 'mapping.noodle': noodle?._id });
    const imgData = await tinyfox.generateUrl(noodleName);
    return embed(user ? { name: user.displayName, iconURL: user.avatarURL() || undefined } : null, imgData.imageUrl, imgData.copyright);
};

/**
 * Configures a noodle to be scheduled for a specific guild, channel, and hour.
 *
 * @param {Guild} guild - The guild where the noodle will be scheduled.
 * @param {string} channel - The channel where the noodle will be posted.
 * @param {string} noodleName - The name of the noodle to be scheduled.
 * @param {number} hour - The hour when the noodle will be posted (in 24-hour format).
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the operation was successful.
 */
export const configureScheduledNoodle = async (guild: Guild, channel: string, noodleName: string, hour: number): Promise<boolean> => {
    const noodle = await Noodle.findOne({ name: noodleName });
    const setup = await ScheduledNoodle.findOneAndUpdate({ guild: guild.id, channel, hour }, { guild: guild.id, channel, hour, noodle }, { upsert: true, runValidators: true });
    return !!setup;
}