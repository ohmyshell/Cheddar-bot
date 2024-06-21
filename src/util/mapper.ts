import { EmbedBuilder } from 'discord.js';
import { Movie, TvShow } from '../api/tmdb';

export const tmdbEntityToEmbed = (entity: Movie | TvShow) => {
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
  if ((entity as TvShow).first_air_date) {
    embed.setURL(process.env.VID_SRC_BASE_URL + 'tv/' + entity.id);
  } else {
    embed.setURL(process.env.VID_SRC_BASE_URL + 'movie/' + entity.id);
  }
  embed.setTitle((entity as Movie).title ?? (entity as TvShow).name);
  return embed;
};
