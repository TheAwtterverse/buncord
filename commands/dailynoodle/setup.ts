import { CommandInteraction, Client, ApplicationCommandType, PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../types/command";
import { configureGuild } from "../../mods/dailynoodle";

export default {
    name: "setupdailynoodle",
    description: "Sets up the daily noodle bot for this server",
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    options: [
        {
            name: "channel",
            description: "The channel to send the daily noodle to",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "noodles",
            description: "The noodles to send",
            type: ApplicationCommandOptionType.String,
            required: true,
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
        const content = "Hello there!";

        await interaction.deferReply({ ephemeral: true });

        const setup = await configureGuild(interaction.guild!, interaction.options.getChannel("channel")!.id, interaction.options.getString("noodles")!.split(","));

        await interaction.editReply({
            content
        });
    }
} as Command;