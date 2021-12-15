import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common.js';

const MAX_DAYS_GAP = 7;

const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs().add(daysGap, 'days').toDate();
};

export const dateFilm = (dueDate, dateFormat) => dayjs(dueDate).format(dateFormat);

export { generateDate };
