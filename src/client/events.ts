import { Client } from 'discord.js';
import { ShardLogger } from '../util/logger';
import { BotEvent } from '../types';
import { join } from 'path';

const events: BotEvent = {
  interactionCreate(interaction) {
    ShardLogger.info('Executing Interaction with type:  ' + interaction?.type);
    if (interaction.isCommand()) {
      require(join(__dirname, 'commands', interaction?.commandName)).execute(
        interaction
      );
    }
  },
  error(error) {
    ShardLogger.error(error);
  },
  debug(message) {
    ShardLogger.debug(message);
  },
  warn(warning) {
    ShardLogger.warn(warning);
  },
  shardDisconnect(closeEvent, shardId) {
    ShardLogger.warn('Shard ' + shardId + ' disconnected: ' + closeEvent);
  },
  shardError(error, shardId) {
    ShardLogger.error('Shard ' + shardId + ' errored: ' + error);
  },
  shardReady(shardId) {
    ShardLogger.info('Shard ' + shardId + ' ready!');
  },
  shardReconnecting(shardId) {
    ShardLogger.info('Shard ' + shardId + ' reconnecting...');
  },
  shardResume(shardId, replayedEvents) {
    ShardLogger.info(
      'Shard ' + shardId + ' resumed with ' + replayedEvents + ' events'
    );
  },
  ready(client) {
    ShardLogger.info('Client ready on shard: ' + client.shard?.ids);
  },
};

export const initClientEvents = (client: Client) => {
  Object.entries(events).forEach(([eventType, handler]) => {
    client.on(eventType, handler);
  });
};
