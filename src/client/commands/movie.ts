import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import {
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovie,
} from '../../api/tmdb';
import { tmdbEntityToEmbed } from '../../util/mapper';

export default {
  command: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Pick a movie to watch')
    .addSubcommand((command) =>
      command
        .setName('list')
        .setDescription('List trending/popular movies')
        .addStringOption((option) =>
          option
            .setName('category')
            .setDescription('Choose a category')
            .setRequired(true)
            .setChoices([
              { name: 'Trending', value: 'trending' },
              { name: 'Popular', value: 'popular' },
              { name: 'Upcoming', value: 'upcoming' },
            ])
        )
    )
    .addSubcommand((command) =>
      command
        .setName('search')
        .setDescription('Search for a movie by name')
        .addStringOption((option) =>
          option
            .setName('moviename')
            .setDescription('Movie name')
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
            const trendingMovies = await getTrendingMovies();
            const trendingMoviesEmbeds = trendingMovies.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: trendingMoviesEmbeds,
            });
            break;
          }
          case 'popular': {
            const popularMovies = await getPopularMovies();
            const popularMoviesEmbeds = popularMovies.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: popularMoviesEmbeds,
            });
            break;
          }
          case 'upcoming': {
            const upcomingMovies = await getUpcomingMovies();
            const upcomingMoviesEmbeds = upcomingMovies.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: upcomingMoviesEmbeds,
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
        const movieName = interaction.options.getString('moviename');
        client.logger.info(`Searching for movie: ${movieName}`);
        if (!movieName) {
          await interaction.editReply({
            content: 'Movie name required',
          });
          break;
        }
        const movies = await searchMovie(movieName);
        if (!movies || !movies.results || movies.results.length === 0) {
          await interaction.editReply({
            content: 'Movie not found',
          });
        }
        await interaction.editReply({
          embeds: movies.results.slice(0, 5).map(tmdbEntityToEmbed),
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
