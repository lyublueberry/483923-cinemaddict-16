import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common.js';

const MAX_DAYS_GAP = 7;

const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs().add(daysGap, 'days').toDate();
};

export const dateFilm = (dueDate, dateFormat) => dayjs(dueDate).format(dateFormat);

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortFilmsByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.dueDate, filmB.dueDate);

  return weight ?? dayjs(filmA.releaseDate).diff(dayjs(filmB.releaseDate));
};

export const sortFilmsByRating = (filmA, filmB) => {
  const ratingA = filmA.rating;
  const ratingB = filmB.rating;

  return ratingB - ratingA;
};

export { generateDate };
