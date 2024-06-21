import { ActivityType, Client } from 'discord.js';
import { configDotenv } from 'dotenv';
import path from 'path';
import { initClientEvents } from './client/events';
import { initClientCommands } from './client/commands';
import { FileLogger, ShardLogger } from './util/logger';
configDotenv({ path: path.join(__dirname, '../.env') });

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
});

client.logger = ShardLogger.child(
  {},
  {
    msgPrefix: '(Shard ' + client.shard?.ids[0] + '): ',
  }
);

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    initClientEvents(client);
    initClientCommands(client);
  })
  .catch((error) => {
    client.logger.fatal('Failed to login: ' + error);
    FileLogger.fatal(error);
  });
