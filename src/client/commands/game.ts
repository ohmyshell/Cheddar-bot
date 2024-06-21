import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { newFitGirlPosts, searchFitGirlPosts } from '../../api/fitgirl';
import { fitGirlEntityToEmbed } from '../../util/mapper';

export default {
  command: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Get game information')
    .addSubcommand((command) =>
      command.setName('list').setDescription('List new games')
    )
    .addSubcommand((command) =>
      command
        .setName('search')
        .setDescription('Search games')
        .addStringOption((option) =>
          option
            .setName('query')
            .setDescription('Search query')
            .setRequired(true)
            .setMinLength(1)
        )
    ) as SlashCommandBuilder,
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    switch (interaction.options.getSubcommand()) {
      case 'list':
        const listPosts = await newFitGirlPosts();
        const listPostsEmbeds = listPosts
          .filter((post) => post.category === 'Lossless Repack')
          .map(fitGirlEntityToEmbed);
        if (listPostsEmbeds.length === 0) {
          interaction.editReply('No games found!');
        }
        await interaction.editReply({
          embeds: listPostsEmbeds,
        });
        break;
      case 'search':
        const query = interaction.options.getString('query');
        const searchPosts = await searchFitGirlPosts(query as string);
        const searchPostsEmbeds = searchPosts
          .slice(0, 5)
          .map(fitGirlEntityToEmbed);
        if (searchPostsEmbeds.length === 0) {
          interaction.editReply('No games found!');
        }
        await interaction.editReply({
          embeds: searchPostsEmbeds,
        });
        break;
      default:
        await interaction.editReply('Invalid subcommand!');
        break;
    }
  },
} as SlashCommand;
