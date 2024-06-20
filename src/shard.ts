import { Client } from 'discord.js';
import { configDotenv } from 'dotenv';
import path from 'path';
import { initClientEvents } from './client/events';
import { initClientCommands } from './client/commands';
import { ShardLogger } from './utitl/logger';
configDotenv({ path: path.join(__dirname, '../.env') });

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    initClientEvents(client);
    initClientCommands(client);
  })
  .catch(ShardLogger.fatal);
