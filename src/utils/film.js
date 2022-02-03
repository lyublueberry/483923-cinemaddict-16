import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {
  getRandomInteger
} from '../utils/common.js';
import { BACKEND_DATE_FORMAT } from './const.js';

const MAX_DAYS_GAP = 7;

export const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs().add(daysGap, 'days').format(BACKEND_DATE_FORMAT);
};

//для продолжительности в часах и минутах
export const getDurationString = (minutes) => {
  const formatTemplate = minutes < 60 ? 'm[m]' : 'H[h] m[m]';
  return dayjs.duration(minutes, 'minutes').format(formatTemplate);
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

export const runtimeToDuration = (runtime) => ({
  hours: Math.floor(runtime / 60),
  minutes: runtime % 60
});
