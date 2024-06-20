import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  ClientEvents,
  ModalSubmitInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { once } from 'events';

export interface SlashCommand {
  command: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
  cooldown?: number; // in seconds
}

export type BotEvent = {
  [K in keyof Partial<ClientEvents>]: (...args: ClientEvents[K]) => void;
};
