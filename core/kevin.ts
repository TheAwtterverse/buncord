import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { Client, CommandInteraction, ApplicationCommandData } from "discord.js";
const logger = require('pino')();
import { Command } from '../types/command';
import { NullClient } from './errors';

/**
 * Command handler to autoload commands
 * 
 * @export class Kevin
 */
export default class Kevin {
    private commands: Map<string, Command>;
    private client: Client;
    private cooldowns: Map<string, number>;
    private static instance: Kevin;

    private constructor(client: Client) {
        this.commands = new Map();
        this.cooldowns = new Map();
        this.client = client;

        this.loadCommandsRecursively('../commands').then((count) => {
            logger.info(`✨ Loaded ${count} command${count > 1 ? 's' : ''}!`);
            this.registerCommands();
        });
    }

    public static getInstance(client: Client | null = null) {
        if (!Kevin.instance) {
            if (!client) throw new NullClient();
            Kevin.instance = new Kevin(client);
        }
        return Kevin.instance;
    }

    public static init(client: Client) {
        Kevin.getInstance(client);
    }

    async handleCommand(interaction: CommandInteraction) {
        const command = this.commands.get(interaction.commandName);
        if (!command) {
            interaction.reply({ content: "Command not found.", ephemeral: true });
            logger.error(`Command not found: ${interaction.commandName}`);
            return;
        }

        if (this.cooldowns.get(`${interaction.user.id}-${command.name}`) !== undefined) {
            return await interaction.reply({ content: `Please wait ${Math.floor((this.cooldowns.get(`${interaction.user.id}-${command.name}`)! - Date.now()) / 1000)} seconds before using this command again.`, ephemeral: true });
        }

        try {
            await command.run(this.client, interaction);
        } catch (error) {
            logger.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
        // Reset cooldown
        if (command.cooldown) {
            this.cooldowns.set(`${interaction.user.id}-${command.name}`, Date.now() + command.cooldown * 1000);
            setTimeout(() => {
                this.cooldowns.delete(`${interaction.user.id}-${command.name}`);
            }, command.cooldown * 1000);
        }
    }

    private async registerCommands(): Promise<void> {
        let commands = new Array<ApplicationCommandData>();
        this.commands.forEach((command) => {
            commands.push(command as ApplicationCommandData);
        });

        this.client.application?.commands?.set(commands);
        logger.info(`🌐 Registered ${commands.length} command${commands.length > 1 ? 's' : ''}!`);
    }

    /**
     * Recursively load commands from a directory
     * @param directory directory to load commands from
     * @returns number of commands loaded
     */
    private async loadCommandsRecursively(directory: string): Promise<number> {
        let count = 0;

        const files = readdirSync(join(__dirname, directory));
        for (const file of files) {
            const stat = lstatSync(join(__dirname, directory, file));
            if (stat.isDirectory()) {
                count += await this.loadCommandsRecursively(join(directory, file));
            } else {
                if (file.startsWith('.')) continue;
                let command = await import(join(__dirname, directory, file));
                if (!command.default.name) continue;
                command = command.default;
                this.commands.set(command.name, command);
                count++;
            }
        }
        return count;
    }
}