import { generateRandomElement } from '../utils/common.js';
import { generateDate } from '../utils/film.js';

/**
 * Комментарий
 * @typedef {Object} Comment
 * @property {String} id
 * @property {String} text
 * @property {String} emotion
 * @property {String} author
 * @property {String} date
 */

const COMMENT_TEXT = ['good film', 'bad film', 'evil film'];
const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const COMMENT_AUTHOR = ['JOHN DOE', 'JANE DOE', 'JOHN JANE'];

/**
 * Генерируем комментарий
 * @param {String} commentId
 * @return {Comment}
 */
const generateComment = (commentId) => ({
  id: commentId,
  text: generateRandomElement(COMMENT_TEXT),
  emotion: generateRandomElement(COMMENT_EMOTIONS),
  author: generateRandomElement(COMMENT_AUTHOR),
  date: generateDate(), //«2019/12/31 23:59»
});

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
