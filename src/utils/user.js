export const UserRank = {
  DEFAULT: '',
  NOVICE: 'novice',
  FUN: 'fun',
  MOVIE_BUFF: 'movie buff',
};

/**
 * Получение ранга пользователя
 * @param {number} watchedFilmsCount - Количество просмотренных фильмов
 * @return {String} - Название пользовательского ранга
 */
export const getUserRank = (watchedFilmsCount) => {
  if (watchedFilmsCount >= 21) {
    return UserRank.MOVIE_BUFF;
  }
  if (watchedFilmsCount >= 11) {
    return UserRank.FUN;
  }
  if (watchedFilmsCount >= 1) {
    return UserRank.NOVICE;
  }
  return UserRank.DEFAULT;
};
