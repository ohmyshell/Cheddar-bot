import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse } from 'path';
export interface FitGirlArticle {
  title?: string;
  category?: string;
  postDate?: string;
  content?: FitGirlArticleContent;
}

export interface FitGirlArticleContent {
  id: string;
  title: string;
  genresTags?: string;
  company?: string;
  languages?: string;
  originalSize?: string;
  repackSize?: string;
  links: string[];
  image?: string;
}

const BASE_URL = 'https://fitgirl-repacks.site/';

/**
 * Retrieves the new posts from the FitGirl website.
 *
 * @return {Promise<FitGirlArticle[]>} A promise that resolves to an array of FitGirlArticle objects.
 */
export const newFitGirlPosts = async (): Promise<FitGirlArticle[]> => {
  const response = (await axios.get(BASE_URL)).data;
  const $ = cheerio.load(response as string);

  return parsePost($);
};

/**
 * Retrieves FitGirl articles based on a search query.
 *
 * @param {string} query - The search query to filter articles.
 * @return {Promise<FitGirlArticle[]>} A promise that resolves to an array of FitGirlArticle objects.
 */
export const searchFitGirlPosts = async (
  query: string
): Promise<FitGirlArticle[]> => {
  const response = (await axios.get(`${BASE_URL}?s=${query}`)).data;
  const $ = cheerio.load(response);
  const articles: FitGirlArticle[] = [];

  for (const entry of $('article').toArray()) {
    const url = $(entry).find('article > header > h1 > a').attr('href');
    const category = $(entry)
      .find('article > header > div:nth-child(1) > span > a')
      .text();
    if (category === 'Lossless Repack' && url) {
      const post = (await axios.get(url)).data;
      articles.push(parsePost(cheerio.load(post), true)[0]);
    }
  }
  return articles;
};

const parsePost = (
  $: cheerio.CheerioAPI,
  search: Boolean = false
): FitGirlArticle[] => {
  return $('article')
    .map((i, el) => {
      let content: FitGirlArticleContent = {
        id: '-',
        title: '-',
        genresTags: '-',
        company: '-',
        languages: '-',
        originalSize: '-',
        repackSize: '-',
        links: [],
        image: '-',
      };

      const category = $(el)
        .find('article > header > div:nth-child(1) > span > a')
        .text();
      const title = search
        ? $(el).find('article > header > h1 > a').text()
        : $(el).find('article > div > h3:nth-child(1) > strong').text();
      const postDate = $(el)
        .find('article > header > div:nth-child(3) > span.entry-date > a')
        .text();

      if (category === 'Lossless Repack') {
        content.id = $(el)
          .find('article > div > h3:nth-child(1) > span')
          .text();
        content.title = $(el)
          .find('article > div > h3:nth-child(1) > strong')
          .text();
        content.genresTags = $(el)
          .find('article > div > p:nth-child(2) > strong:nth-child(3)')
          .text();
        content.company = $(el)
          .find('article > div > p:nth-child(2) > strong:nth-child(5)')
          .text();
        content.languages = $(el)
          .find('article > div > p:nth-child(2) > strong:nth-child(7)')
          .text();
        content.originalSize = $(el)
          .find('article > div > p:nth-child(2) > strong:nth-child(9)')
          .text();
        content.repackSize = $(el)
          .find('article > div > p:nth-child(2) > strong:nth-child(11)')
          .text();
        if (search) {
          content.links = $(el)
            .find('article > div > ul:nth-child(5) > li:nth-child(1) > a')
            .map((i, el) => $(el).attr('href'))
            .toArray();
        } else {
          content.links = $(el)
            .find('article > div > ul:nth-child(8) > li:nth-child(1) > a')
            .map((i, el) => $(el).attr('href'))
            .toArray();
        }
        content.image = $(el)
          .find('article > div > p:nth-child(2) > a > img')
          .attr('src');
      }

      return { category, title, postDate, content };
    })
    .toArray();
};
