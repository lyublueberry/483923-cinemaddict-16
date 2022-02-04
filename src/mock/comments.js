import { generateRandomElement } from '../utils/common.js';
import { generateDate } from '../utils/film.js';

/**
 * Комментарий к фильму
 * @param {string} id - Идентфиикатор комментария
 * @param {string} author - Автор
 * @param {string} comment - Текст комментария
 * @param {string} date - Дата ('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
 * @param {string} emotion - Эмоция
 */
export const FilmComment = function ({ id, author, comment, date, emotion }) {
  this.id = id;
  this.author = author;
  this.comment = comment;
  this.date = date;
  this.emotion = emotion;
};

const COMMENT_TEXT = ['good film', 'bad film', 'evil film'];
const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const COMMENT_AUTHOR = ['JOHN DOE', 'JANE DOE', 'JOHN JANE'];

export const getRandomAuthor = () => generateRandomElement(COMMENT_AUTHOR);

/**
 * Генерируем комментарий
 * @param {string} commentId
 * @returns {FilmComment} Комментарий
 */
const generateComment = (commentId) => (new FilmComment({
  id: commentId,
  author: getRandomAuthor(),
  comment: generateRandomElement(COMMENT_TEXT),
  emotion: generateRandomElement(COMMENT_EMOTIONS),
  date: generateDate(),
}));

/**
 * Генерируем комментарии
 * @param {Array} films
 * @return {Array} comments
 */
export const generateComments = (films) => {
  const comments = [];

  films.forEach((film) => {
    film.comments.forEach((commentId) => {
      comments.push(generateComment(commentId));
    });
  });
  return comments;
};
