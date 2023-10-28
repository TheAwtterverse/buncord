import { Client, Events, GatewayIntentBits } from "discord.js";
const logger = require('pino')();
import loader from './core/loader';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Load events ✨
loader('events/', client);

client.login(process.env.DISCORD_TOKEN);

loader('mods/', client);