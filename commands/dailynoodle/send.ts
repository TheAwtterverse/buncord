import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../types/command";
import { getNoodleEmbed } from "../../mods/dailynoodle/helpers";

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
        const embed = await getNoodleEmbed(interaction.options.getString("noodle") || "Otter", interaction.user);
        if (embed) {
            await interaction.editReply({
                embeds: [embed]
            });
        } else {
            await interaction.editReply({
                content: "Something went wrong."
            });
        }
    }
} as Command;