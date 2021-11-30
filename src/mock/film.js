import { generateRandomElement, getRandomInteger, generateDate, generateRandomBoolean, randomArrayValues } from '../util';
import { generateCommentFilm } from '../mock/comments.js';

const POSTER_PICTURES_FILM = ['./images/posters/made-for-each-other.png', './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg', './images/posters/the-man-with-the-golden-arm.jpg',
  './images/posters/the-great-flamarion.jpg', './images/posters/the-dance-of-life.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg'];

const NAME_FILM = ['Le Fabuleux destin Amélie Poulain','Elementary', 'Eternal Sunshine of the Spotless Mind', 'Nobody', 'Bohemian Rhapsody'];

const GENRE_FILM = ['action', 'comedy', 'drama', 'crime', 'thriller'];

const DESCRIPTION_FILM_SHORT = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

const DIRECTOR_FILM = ['Роберт Земекис', 'Фрэнк Дарабонт', 'Квентин Тарантино'];
const SCREENWRITERS_FILM= ['Эрик Рот', 'Уинстон Грум', 'Фрэнк Дарабонт', 'Стивен Кинг'];
const ACTORS_FILM = ['Том Хэнкс', 'Робин Райт', 'Салли Филд'];
const COUNTRY = ['Russia', 'USA', 'Spain'];

export const generateCardFilm = () => ({
  poster: generateRandomElement(POSTER_PICTURES_FILM),
  filmName: generateRandomElement(NAME_FILM),
  rating: `${getRandomInteger(1, 9)}.${getRandomInteger(0, 9)}`,
  duration: `${getRandomInteger(0, 5)} h, ${getRandomInteger(0, 59)} m`, //« 1 h 36 m»
  genre: generateRandomElement(GENRE_FILM),
  genres: randomArrayValues(GENRE_FILM),
  description: generateRandomElement(DESCRIPTION_FILM_SHORT),
  countComment: getRandomInteger(0, 100),
  originalName: generateRandomElement(NAME_FILM),
  director:generateRandomElement(DIRECTOR_FILM),
  screenwriters: randomArrayValues(SCREENWRITERS_FILM),
  actors: randomArrayValues(ACTORS_FILM),
  releaseDate: generateDate(),
  country:generateRandomElement(COUNTRY),
  ageRating:getRandomInteger(0, 18),
  isWatchlist: generateRandomBoolean(),
  isWatched: generateRandomBoolean(),
  isFavorites: generateRandomBoolean(),
  comments: new Array(getRandomInteger(1, 5)).fill('').map(generateCommentFilm)
});

export {POSTER_PICTURES_FILM, NAME_FILM, GENRE_FILM, DESCRIPTION_FILM_SHORT};
