import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRandomElement = (nameElement) => {
  const randomIndex = getRandomInteger(0, nameElement.length - 1);
  return nameElement[randomIndex];
};

const MAX_DAYS_GAP = 7;

const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs().add(daysGap, 'days').toDate();
};

export const randomArrayValues = function (arrayElements){
  arrayElements = arrayElements.slice();

  for (let i = 0 ; i < arrayElements.length ; i++) {
    const j = Math.floor(Math.random() * (arrayElements.length - i)) + i;
    const item = arrayElements[j];
    arrayElements[j] = arrayElements[i];
    arrayElements[i] = item;
  }
  arrayElements.splice(0, getRandomInteger(0, arrayElements.length - 1));
  return arrayElements;
};

export const dateFilm = (dueDate, dateFormat) => dayjs(dueDate).format(dateFormat);

const generateRandomBoolean = () => Boolean(getRandomInteger(0, 1));

export {
  getRandomInteger,
  generateRandomElement,
  generateDate,
  generateRandomBoolean
};
