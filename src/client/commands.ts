import { Client, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand } from '../types';
import { ShardLogger } from '../utitl/logger';

export const initClientCommands = (client: Client) => {
  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_TOKEN as string
  );

  const slashCommandsDir = join(__dirname, './commands');
  const slashCommands: SlashCommandBuilder[] = [];

  readdirSync(slashCommandsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;
    const command: SlashCommand = require(join(slashCommandsDir, file)).default;
    slashCommands.push(command.command);
  });

  rest
    .put(Routes.applicationCommands(client.user?.id as string), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    .then((data: any) =>
      ShardLogger.info(`Registered ${data.length} slash command(s).`)
    )
    .catch((error) => ShardLogger.error(error));
};
