import { Client, Interaction, Events } from "discord.js";
import CommandHandler from "../core/kevin";

export default (client: Client) => {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            CommandHandler.getInstance(client).handleCommand(interaction);
        }
    });
};
