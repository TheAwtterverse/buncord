import type { Client, Guild, Embed, GuildMember } from 'discord.js';
import type { ApiRespone, BirthdayEntity } from '../types/awtterSpace';
import { Database } from "bun:sqlite";

const logger = require('pino')();
const DB_STRING = "data/birthdays.sqlite";

const guilds = new Map<string, Guild>();

const fetchBirthdays = async (): Promise<Array<BirthdayEntity>> => {

    logger.info('Fetching birthdays from AwtterSpace API');
    const res = await fetch(`${process.env.AWTTERSPACE_URL}api/v2/users/birthdays`, {
        headers: {
            Authorization: `Token ${process.env.AWTTERSPACE_TOKEN}`
        }
    });
    if (res.ok) {
        return (await res.json()).data as Array<BirthdayEntity>;
    }
    return [];
};

const generateEmbed = (member: GuildMember): Embed => {
    return {
        title: '',
        color: 0xd548c0,
        author: {
            name: 'Awtter Birthday',
            iconURL: 'https://i.imgur.com/3yU123m.png'
        },
        thumbnail: { url: member.displayAvatarURL() },
        description: `Happy day of the birth ${member.displayName} !! 🎂`
    } as Embed;
}

export default async (client: Client) => {
    initDatabase();

    const dbGuilds = getParticipatingGuilds();

    dbGuilds?.forEach(async (guild) => {
        const guildObj = await client.guilds.fetch(guild.guildId);
        guilds.set(guild.guildId, guildObj);
    });

    setInterval(async () => {

        // skip before 8PM UTC
        if (new Date().getHours() < 20) return;
        for (const guild of guilds.values()) {
            await sendBirthdayMessage(guild);
        }
    }, 1000 * 60 * 60 * 2);
}

/**
 * Send birthday messages to a guild
 * @param guild Guild object
 * @returns True if successful, False if not
 */
export const sendBirthdayMessage = async (guild: Guild): Promise<boolean> => {
    const db = new Database(DB_STRING);
    const birthdayChannel = db.query(`SELECT channelId, lastDaySent FROM birthdays WHERE guildId = $guildId;`).get({ $guildId: guild.id }) as { channelId: string, lastDaySent: number } | null;
    if (!birthdayChannel) return false;
    if (new Date().getDate() <= birthdayChannel.lastDaySent) return false;

    const birthdays = await fetchBirthdays();
    let birthdayEmbeds = [];
    let memberMentions = [];
    for (const birthday of birthdays) {
        try {
            const member = await guild.members.fetch(birthday.discord)
            if (!member) continue;
            birthdayEmbeds.push(generateEmbed(member))
            memberMentions.push(`<@${member.id}>`);
        }
        catch {
            logger.error(`Could not fetch member ${birthday.discord} from guild ${guild.id}`);
        }
    }
    try {
        const channel = await guild.channels.fetch(birthdayChannel.channelId)
        if (memberMentions.length > 0 && birthdayEmbeds.length > 0)
            if (channel?.isTextBased()) channel.send({ content: memberMentions.join(' '), embeds: birthdayEmbeds })
    }
    catch {
        logger.error(`Could not fetch channel ${birthdayChannel.channelId} from guild ${guild.id}`);
        db.close();
        return false;
    }
    db.query(`UPDATE birthdays SET lastDaySent = $lastDaySent WHERE guildId = $guildId;`).run({ $lastDaySent: new Date().getDate(), $guildId: guild.id });
    db.close();
    return true;
}

/**
 * Initialize the database
 */
const initDatabase = () => {
    const db = new Database(DB_STRING, { create: true });
    db.query(`CREATE TABLE IF NOT EXISTS birthdays (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guildId TEXT NOT NULL,
        channelId TEXT NOT NULL,
        lastDaySent INTEGER DEFAULT 0
    );`).run();
    db.close();
};

/**
 * Get all participating guilds
 * @returns Array of guilds
 */
export const getParticipatingGuilds = (): Array<{ guildId: string }> | null => {
    const db = new Database(DB_STRING);
    const guilds = db.query(`SELECT guildId FROM birthdays;`).all() as Array<{ guildId: string }> | null;
    db.close();
    return guilds;
}

/**
 * Add a birthday channel to the database
 * @param guild Guild object
 * @param channelId Channel ID
 * @returns True if successful
 */
export const addBirthdayChannel = (guild: Guild, channelId: string) => {

    const db = new Database(DB_STRING);
    const exists = db.query(`SELECT * FROM birthdays WHERE guildId = $guildId;`).get({ $guildId: guild.id });
    if (exists) {
        db.query(`UPDATE birthdays SET channelId = $channelId WHERE guildId = $guildId;`).run({ $channelId: channelId, $guildId: guild.id });
    }
    else {
        db.query(`INSERT INTO birthdays (guildId, channelId) VALUES ($guildId, $channelId);`).run({ $channelId: channelId, $guildId: guild.id });
        guilds.set(guild.id, guild);
    }
    db.close();

    return true;
}

/**
 * Delete a birthday channel from the database
 * @param guildId Guild ID
 * @returns True if successful
 */
export const deleteBirthdayChannel = (guildId: string) => {

    const db = new Database(DB_STRING);
    db.query(`DELETE FROM birthdays WHERE guildId = $guildId;`).run({ $guildId: guildId });
    db.close();
    guilds.delete(guildId);
    return true;
}