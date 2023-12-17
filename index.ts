import { Client, GatewayIntentBits } from "discord.js";
import loader from './core/loader';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        //GatewayIntentBits.MessageContent,
        //GatewayIntentBits.GuildMembers
    ]
});

// Load events ✨
loader('events/', client);

client.login(process.env.DISCORD_TOKEN);

loader('mods/', client);