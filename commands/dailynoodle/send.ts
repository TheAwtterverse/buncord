import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../types/command";
import { getNoodleEmbed } from "../../mods/dailynoodle";

export default {
    name: "sendpic",
    description: "Sends a pic to the channel",
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    options: [
        {
            name: "noodle",
            description: "The noodle to send",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: "Otter",
                    value: "Otter"
                },
                {
                    name: "Ferret",
                    value: "Ferret"
                },
                {
                    name: "Marten",
                    value: "Marten"
                },
                {
                    name: "Badger",
                    value: "Badger"
                }
            ]
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply();
        await interaction.editReply({
            embeds: [await getNoodleEmbed(interaction.options.getString("noodle") ?? "Otter")]
        });
    }
} as Command;