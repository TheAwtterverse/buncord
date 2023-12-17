import * as mongoose from 'mongoose';
import type { Client, Guild, Embed, GuildMember, EmbedBuilder } from 'discord.js';
import { Noodle, NoodleStash, Provider, GuildSetup } from './dailynoodle/schemas';
import init from './dailynoodle/init';
import embed from './dailynoodle/embed';

await init();

await mongoose.connect('mongodb://127.0.0.1:27017/dailynoodle');

let botClient: Client;

export default async (client: Client) => {

    client.once('ready', async () => {
        botClient = client;
        const setups = await GuildSetup.find();
        setups.forEach(async (setup) => {
            if (!client.guilds.cache.has(setup.guild)) return;

            const guild = client.guilds.cache.get(setup.guild)!;
            const channel = guild.channels.cache.get(setup.channel);
            if (channel && channel.isTextBased()) {

                await channel.send({ embeds: [await getNoodleEmbed("Ferret")] });
            }
        });

    });
    const noodles = await Noodle.find();
    const tinyfox = await Provider.findOne({ name: 'TinyFox' });
    const otter = noodles.find(n => n.name === 'Otter');
    console.log(await getAvailableNoodles());
    if (otter)
        console.log(tinyfox?.generateUrl(otter));
    else
        console.log('Otter not found');
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

export const getNoodleEmbed = async (noodleName: string): Promise<EmbedBuilder> => {

    const noodle = await Noodle.findOne({ name: noodleName });
    const provider = await Provider.findOne({ 'mapping.noodle': noodle?._id });
    const getLink = provider?.generateUrl(noodle!);
    const imageRes = await fetch(getLink!);
    const image = await imageRes.json();
    if (!image.hasOwnProperty('loc')) {
        throw new Error('The "loc" attribute does not exist in the response');
    }
    return embed(botClient.user!, `https://tinyfox.dev${image.loc}`, 'TinyFox.dev');
};