import type { Client } from 'discord.js';

const fetchBirthdays = async () => {

    const res = await fetch(`${process.env.AWTTERSPACE_URL}api/v2/users/birthdays`, {
        headers: {
            Authorization: `Token ${process.env.AWTTERSPACE_TOKEN}`
        }
    });
    console.log(await res.json());
};

const fetchGuilds = async () => {
    const res = await fetch('https://discord.com/api/v9/users/@me/guilds', {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });
    console.log(await res.json());
};

export default async (client: Client) => {
    console.log('Hello from AwtterSpace Birthdays!');
    fetchBirthdays();
    fetchGuilds();
}