import { EmbedBuilder } from 'discord.js';
import { Movie, TvShow } from '../api/tmdb';
import { FitGirlArticle } from '../api/fitgirl';

export const tmdbEntityToEmbed = (entity: Movie | TvShow) => {
  const embed = new EmbedBuilder();
  embed.addFields([
    {
      name: 'Overview',
      value: entity.overview != '' ? entity.overview : '-',
    },
    {
      name: 'Release Date',
      value:
        (entity as Movie).release_date ?? (entity as TvShow).first_air_date,
    },
  ]);
  embed.setThumbnail('https://image.tmdb.org/t/p/w300' + entity.poster_path);
  if ((entity as TvShow).first_air_date) {
    embed.setURL(process.env.VID_SRC_BASE_URL + 'tv/' + entity.id);
  } else {
    embed.setURL(process.env.VID_SRC_BASE_URL + 'movie/' + entity.id);
  }
  embed.setTitle((entity as Movie).title ?? (entity as TvShow).name);
  return embed;
};

export const fitGirlEntityToEmbed = (entity: FitGirlArticle) => {
  const embed = new EmbedBuilder();
  embed.addFields([
    { name: 'category', value: entity.category ?? '-', inline: true },
    {
      name: 'Post Date',
      value: entity.postDate ?? '-',
      inline: true,
    },
    {
      name: 'Genres/Tags',
      value: entity.content?.genresTags ?? '-',
      inline: true,
    },
    {
      name: 'Original Size',
      value: entity.content?.originalSize ?? '-',
      inline: true,
    },
    {
      name: 'Repack Size',
      value: entity.content?.repackSize ?? '-',
      inline: true,
    },
    {
      name: 'Languages',
      value: entity.content?.languages ?? '-',
      inline: true,
    },
    {
      name: 'Date',
      value: entity.postDate ?? '-',
      inline: true,
    },
    {
      name: 'Torrent',
      value: entity.content?.links[2] ?? '-',
      inline: true,
    },
  ]);
  embed.setColor('#00FF00');
  embed.setFooter({ text: 'Company: ' + entity.content?.company ?? '-' });
  embed.setThumbnail(entity.content?.image ?? '-');
  if (entity.content?.links && entity.content?.links?.length > 0) {
    embed.setURL(entity.content?.links[0]);
  }
  embed.setTitle(entity.content?.id + ' ' + entity.content?.title);
  return embed;
};
