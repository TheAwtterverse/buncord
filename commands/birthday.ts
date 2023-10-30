import { CommandInteraction, Client, ApplicationCommandType, PermissionFlagsBits } from "discord.js";
import { Command } from "../types/command";
import { addBirthdayChannel, deleteBirthdayChannel, sendBirthdayMessage } from '../mods/awtterspaceBirthdays';

export default {
    name: "birthday",
    description: "Birthday commands for AwtterSpace",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    type: ApplicationCommandType.ChatInput,
    cooldown: 10,
    options: [
        {
            name: 'action',
            description: 'Select an action you want to do',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Set',
                    value: 'set'
                },
                {
                    name: 'Send',
                    value: 'send'
                },
                {
                    name: 'Remove',
                    value: 'remove'
                }
            ]
        }
    ],
    run: async (client: Client, interaction: CommandInteraction) => {

        if (!interaction || !interaction.guild || !interaction.channel) return interaction.reply({ content: 'This command can only be used in a server', ephemeral: true });

        const action = interaction.options.get('action')?.value as string;
        let content = 'Something went wrong';
        switch (action) {
            case 'set':
                if (addBirthdayChannel(interaction.guild, interaction.channel.id))
                    content = 'Birthday channel set!';
                break;
            case 'remove':
                if (deleteBirthdayChannel(interaction.guild.id))
                    content = 'Birthday channel removed!';
                break;
            case 'send':
                if (await sendBirthdayMessage(interaction.guild))
                    content = 'Birthday messages sent!';
                else
                    content = 'Birthday messages could not be sent! Is the channel set?';
                break;
        }

        await interaction.reply({
            ephemeral: true,
            content
        });
    }
} as Command;