import { ShardingManager } from 'discord.js';
import { configDotenv } from 'dotenv';
import { GeneralLogger } from './utitl/logger';
import { join } from 'path';
configDotenv({ path: join(__dirname, '../.env') });

const manager = new ShardingManager(join(__dirname, 'shard.js'), {
  token: process.env.DISCORD_TOKEN,
});

manager.on('shardCreate', (shard) =>
  GeneralLogger.info(`Successfully launched shard ${shard.id}`)
);

manager.spawn();
