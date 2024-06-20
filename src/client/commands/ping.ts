import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';

export default {
  command: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
} as SlashCommand;
