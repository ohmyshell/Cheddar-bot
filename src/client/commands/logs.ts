import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { readFileSync } from 'fs';
import { join } from 'path';
import { newFitGirlPosts } from '../../api/fitgirl';

export default {
  command: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Get last few lines of logs'),
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.user.id === '188612164129521665') {
      let log = readFileSync(
        join(__dirname, '..', '..', 'util', 'app.log')
      ).toString();
      log = log.replace(/\\n/g, '\n');
      log = log.substring(log.length - 1900);
      interaction.editReply('```' + log + '```');
    } else {
      interaction.editReply("HEY! You're not allowed to use this command!");
    }
  },
} as SlashCommand;
