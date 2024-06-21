import { ActivityType, Client } from 'discord.js';
import { FileLogger, ShardLogger } from '../util/logger';
import { BotEvent } from '../types';
import { join } from 'path';

const events: BotEvent = {
  async interactionCreate(client, interaction) {
    if (interaction.isChatInputCommand()) {
      await require(join(
        __dirname,
        'commands',
        interaction?.commandName
      )).default.execute(client, interaction);
    } else if (interaction.isAnySelectMenu()) {
    } else if (interaction.isAutocomplete()) {
    } else if (interaction.isButton()) {
    } else if (interaction.isModalSubmit()) {
    }
  },
  error(client, error) {
    FileLogger.error(error);
    client.logger.error(error);
  },
  debug(client, message) {
    FileLogger.debug(message);
    client.logger.debug(message);
  },
  warn(client, warning) {
    FileLogger.warn(warning);
    client.logger.warn(warning);
  },
  shardDisconnect(client, closeEvent, shardId) {
    client.logger.warn('Shard ' + shardId + ' disconnected: ' + closeEvent);
  },
  shardError(client, error, shardId) {
    client.logger.error('Shard ' + shardId + ' errored: ' + error);
  },
  shardReady(client, shardId) {
    client.logger.info('Shard ' + shardId + ' ready!');
  },
  shardReconnecting(client, shardId) {
    client.logger.info('Shard ' + shardId + ' reconnecting...');
  },
  shardResume(client, shardId, replayedEvents) {
    client.logger.info(
      'Shard ' + shardId + ' resumed with ' + replayedEvents + ' events'
    );
  },
  ready(client) {
    client.logger.info('Client ready on shard: ' + client.shard?.ids);
    client.user?.setActivity("🧀 It ain't easy being cheesy", {
      type: ActivityType.Custom,
    });
  },
};

export const initClientEvents = (client: Client) => {
  Object.entries(events).forEach(([eventType, handler]) => {
    client.on(eventType, (...args) =>
      handler(client, ...(args as unknown as never[]))
    );
  });
};
