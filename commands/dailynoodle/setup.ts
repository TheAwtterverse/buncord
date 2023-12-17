import { CommandInteraction, Client, ApplicationCommandType, PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../types/command";
import { configureScheduledNoodle } from "../../mods/dailynoodle";

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
            name: "noodle",
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
        },
        {
            name: "hour",
            description: "The hour to send the noodle (in 24-hour format)",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {

        await interaction.deferReply({ ephemeral: true });

        const setup = await configureScheduledNoodle(interaction.guild!, interaction.options.getChannel("channel")!.id, interaction.options.getString("noodle"), interaction.options.getInteger("hour")!);

        await interaction.editReply({
            content: setup ? `The daily noodle has been set up for this server!` : `The daily noodle could not be set up for this server!`
        });
    }
} as Command;