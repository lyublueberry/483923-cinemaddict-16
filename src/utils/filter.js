import { FilterType, PeriodType } from './const';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * @type {Object.<string, (films) => []>}
 */
export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorites),
  [PeriodType.ALL_TIME]: (films) => films.filter(() => true),
  [PeriodType.TODAY]: (films) => films.filter((film) => (dayjs.utc().diff(film.watchingDate, 'day') <= 1)),
  [PeriodType.WEEK]: (films) => films.filter((film) => (dayjs.utc().diff(film.watchingDate, 'day') <= 7)),
  [PeriodType.MONTH]: (films) => films.filter((film) => (dayjs.utc().diff(film.watchingDate, 'day') <= 30)),
  [PeriodType.YEAR]: (films) => films.filter((film) => (dayjs.utc().diff(film.watchingDate, 'day') <= 365)),
};
