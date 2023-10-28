import { CommandInteraction, Client, ApplicationCommandType, PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../types/command";

export default {
    name: "hello",
    description: "Returns a greeting",
    defaultMemberPermissions: PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers,
    type: ApplicationCommandType.ChatInput,
    cooldown: 5,
    options: [],
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Hello there!";

        await interaction.reply({
            ephemeral: true,
            content
        });
    }
} as Command;