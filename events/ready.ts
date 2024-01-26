import { Client, Events } from "discord.js";
import CommandHandler from "../core/kevin";
const logger = require('pino')();

export default (client: Client) => {
    client.once(Events.ClientReady, () => {
        if (!client.user || !client.application) return;

        logger.info(`🚀 ${client.user.username} is online!`)
        CommandHandler.init(client);
    });
};
