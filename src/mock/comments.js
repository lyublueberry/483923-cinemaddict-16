import { generateRandomElement } from '../utils/common.js';
import { generateDate } from '../utils/film.js';


const COMMENT_TEXT = ['good film', 'bad film', 'evil film'];
const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const COMMENT_AUTHOR = ['JOHN DOE', 'JANE DOE', 'JOHN JANE'];

export const generateCommentFilm = () => ({
  text: generateRandomElement(COMMENT_TEXT),
  emotion: generateRandomElement(COMMENT_EMOTIONS),
  author: generateRandomElement(COMMENT_AUTHOR),
  date: generateDate(), //«2019/12/31 23:59»
});
