const filmToFilterMap =  {
  watchlistF: (films) => films.filter((film) => !film.isWatchlist).length,
  historyF: (films) => films.filter((film) => !film.isWatched).length,
  favoritesF: (films) => films.filter((film) => !film.isFavorites).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
