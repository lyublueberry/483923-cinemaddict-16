import { generateRandomElement, dateFilm } from '../util';

const COMMENT_TEXT = ['good film', 'bad film', 'evil film'];
const COMMENT_EMOTIONS = ['./images/emoji/angry.png', './images/emoji/sleeping.png', './images/emoji/puke.png', './images/emoji/angry.png'];
const COMMENT_AUTHOR = ['JOHN DOE', 'JANE DOE', 'JOHN JANE'];
const formatDate = 'YYYY/MM/DD HH:mm';

export const generateCommentFilm = () => ({
  text: generateRandomElement(COMMENT_TEXT),
  emotion: generateRandomElement(COMMENT_EMOTIONS),
  author: generateRandomElement(COMMENT_AUTHOR),
  date: dateFilm(formatDate), //«2019/12/31 23:59»
});
