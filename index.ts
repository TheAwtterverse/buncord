import { Client, Events, GatewayIntentBits } from "discord.js";
const logger = require('pino')();
import ReadyEvent from "./events/ready";
import InteractionCreateEvent from './events/interactionCreate';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

ReadyEvent(client);
InteractionCreateEvent(client);

client.login(process.env.DISCORD_TOKEN);