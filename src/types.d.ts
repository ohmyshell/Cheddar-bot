import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  ModalSubmitInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { once } from 'events';

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (client: Client, interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
  cooldown?: number; // in seconds
}

export type BotEvent = {
  [K in keyof Partial<ClientEvents>]: (
    client: Client,
    ...args: ClientEvents[K]
  ) => void;
};

declare module 'discord.js' {
  export interface Client {
    logger?: pino.Logger;
    db?: any;
  }
}
