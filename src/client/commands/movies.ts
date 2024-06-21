import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import {
  Movie,
  TvShow,
  getPopularMovies,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovie,
} from '../../api/tmdb';

export default {
  command: new SlashCommandBuilder()
    .setName('movies')
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
      case 'list':
        const category = interaction.options.getString('category');
        switch (category) {
          case 'trending':
            const trendingMovies = await getTrendingMovies();
            const trendingMoviesEmbeds = trendingMovies.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: trendingMoviesEmbeds,
            });
            break;
          case 'popular':
            const popularMovies = await getPopularMovies();
            const popularMoviesEmbeds = popularMovies.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: popularMoviesEmbeds,
            });
            break;
          case 'upcoming':
            const upcomingMovies = await getUpcomingMovies();
            const upcomingMoviesEmbeds = upcomingMovies.results
              .slice(0, 5)
              .map(tmdbEntityToEmbed);
            await interaction.editReply({
              embeds: upcomingMoviesEmbeds,
            });
            break;
          default:
            await interaction.editReply({
              content: 'Invalid category',
            });
            break;
        }
      case 'search':
        const movieName = interaction.options.getString('moviename');
        client.logger.info(`Searching for movie: ${movieName}`);
        if (!movieName) {
          await interaction.editReply({
            content: 'Movie name required',
          });
          break;
        }
        const movies = await searchMovie(movieName);
        if (!movies || !movies.results) {
          await interaction.editReply({
            content: 'Movie not found',
          });
        }
        await interaction.editReply({
          embeds: movies.results.slice(0, 5).map(tmdbEntityToEmbed),
        });
        break;
      default:
        await interaction.editReply('Invalid subcommand');
        break;
    }
  },
} as SlashCommand;

const tmdbEntityToEmbed = (entity: Movie | TvShow) => {
  const embed = new EmbedBuilder();
  embed.addFields({
    name: 'Overview',
    value: entity.overview != '' ? entity.overview : '-',
  });
  embed.addFields({
    name: 'Release Date',
    value: (entity as Movie).release_date ?? (entity as TvShow).first_air_date,
  });
  embed.setThumbnail('https://image.tmdb.org/t/p/w300' + entity.poster_path);
  embed.setURL(process.env.VID_SRC_BASE_URL + 'movie/' + entity.id);
  embed.setTitle((entity as Movie).title ?? (entity as TvShow).name);
  return embed;
};
