const filmToFilterMap =  {
  Watchlist: (films) => films.filter((film) => !film.isWatchlist).length,
  History: (films) => films.filter((film) => !film.isWatched).length,
  Favorites: (films) => films.filter((film) => !film.isFavorites).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
