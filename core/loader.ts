import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const logger = require('pino')();
import type { Client } from 'discord.js';

/**
 * Load helper to load client functions
 * 
 * @param {string} path
 * @param {Client} client
 */
export default async (path: string, client: Client) => {
    try {
        const files: string[] = readdirSync(join(import.meta.dir, path)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of files) {
            const { default: loadable } = await import(join(import.meta.dir, path, file));
            loadable(client);
        }
        logger.info(`✨ Loaded ${files.length} loadables from ${path}`);
    } catch (error) {
        logger.error(error);
    }
}