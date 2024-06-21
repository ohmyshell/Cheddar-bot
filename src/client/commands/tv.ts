import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import {
  discoverTvShow,
  getPopularTv,
  getTrendingTv,
  getUpcomingTv,
  searchTv,
} from '../../api/tmdb';
import { tmdbEntityToEmbed } from '../../util/mapper';

export default {
  command: new SlashCommandBuilder()
    .setName('tv')
    .setDescription('Pick a tv show to watch')
    .addSubcommand((command) =>
      command
        .setName('list')
        .setDescription('List trending/popular tv shows')
        .addStringOption((option) =>
          option
            .setName('category')
            .setDescription('Choose a category')
            .setRequired(true)
            .setChoices([
              { name: 'Trending', value: 'trending' },
              { name: 'Popular', value: 'popular' },
              { name: 'Upcoming', value: 'upcoming' },
              { name: 'Discover', value: 'discover' },
            ])
        )
    )
    .addSubcommand((command) =>
      command
        .setName('search')
        .setDescription('Search for a tv show by name')
        .addStringOption((option) =>
          option
            .setName('tvshowname')
            .setDescription('Tv show name')
            .setRequired(true)
            .setMinLength(1)
        )
    ) as SlashCommandBuilder,
  async execute(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    switch (interaction.options.getSubcommand()) {
      case 'list': {
        const category = interaction.options.getString('category');
        switch (category) {
          case 'trending': {
            const trendingTvShow = await getTrendingTv();
            const trendingTvShowEmbeds = trendingTvShow.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: trendingTvShowEmbeds,
            });
            break;
          }
          case 'popular': {
            const popularTvShow = await getPopularTv();
            const popularTvShowEmbeds = popularTvShow.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: popularTvShowEmbeds,
            });
            break;
          }
          case 'upcoming': {
            const upcomingTvShow = await getUpcomingTv();
            const upcomingTvShowEmbeds = upcomingTvShow.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: upcomingTvShowEmbeds,
            });
            break;
          }
          case 'discover': {
            const discoverTvShows = await discoverTvShow({});
            const discoverTvShowEmbeds = discoverTvShows.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: discoverTvShowEmbeds,
            });
            break;
          }
          default: {
            await interaction.editReply({
              content: 'Invalid category',
            });
            break;
          }
        }
        break;
      }
      case 'search': {
        const tvShowName = interaction.options.getString('tvshowname');
        client.logger.info(`Searching for movie: ${tvShowName}`);
        if (!tvShowName) {
          await interaction.editReply({
            content: 'Movie name required',
          });
          break;
        }
        const tvShows = await searchTv(tvShowName);
        if (!tvShows || !tvShows.results || tvShows.results.length === 0) {
          await interaction.editReply({
            content: 'Tv show not found',
          });
        }
        await interaction.editReply({
          embeds: tvShows.results.slice(0, 5).map(tmdbEntityToEmbed),
        });
        break;
      }
      default: {
        await interaction.editReply('Invalid subcommand');
        break;
      }
    }
  },
} as SlashCommand;
