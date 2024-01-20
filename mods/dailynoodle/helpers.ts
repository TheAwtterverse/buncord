import mongoose from 'mongoose';
import type { Guild, EmbedBuilder, User } from 'discord.js';
const logger = require('pino')().child({ module: 'DailyNoodle' });
import { Noodle, Provider, ScheduledNoodle } from './schemas';
import embed from './embed';
import tinyfox from './providers/tinyfox';

export const connectDB = async () => {
    logger.info('Trying to connect to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        logger.info('🚀 Connected to MongoDB!');
    } catch (err: any) {
        logger.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

/**
 * Generates an embed for a noodle with a given name.
 *
 * @param {string} noodleName - The name of the noodle for which to generate an embed.
 * @param {User} [user] - The discord user requesting the noodle embed. Optional.
 * @returns {Promise<EmbedBuilder>} - A promise that resolves to an EmbedBuilder, which can be used to build the embed.
 *
 * @example
 * // Generate an embed for a noodle named "Otter"
 * getNoodleEmbed("Otter");
 */
export const getNoodleEmbed = async (noodleName: string, user?: User): Promise<EmbedBuilder> => {

    //const noodle = await Noodle.findOne({ name: noodleName });
    //const provider = await Provider.findOne({ 'noodles._id': noodle?._id });
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