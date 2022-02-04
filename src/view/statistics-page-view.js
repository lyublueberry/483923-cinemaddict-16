import AbstractView from './abstract-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {runtimeToDuration} from '../utils/film.js';
import {PeriodType} from '../utils/const.js';
import {getUserRank} from '../utils/user.js';

const getGenresStat = (films) => {
  const genreCount = films
    .reduce((genres, film) => [...genres, ...film.genre], [])
    .reduce((genres, genre) => ({
      ...genres,
      ...{
        [genre]: (genres[genre] || 0) + 1
      }
    }), {});

  const sortedGenreCount = Object.entries(genreCount).sort((genreA, genreB) => genreB[1] - genreA[1]);
  return sortedGenreCount;
};


/**
 * @returns {String} топовый жанр
 */
const getTopGenre = (films) => {
  if (!films) {
    return '';
  }

  if (!films.length) {
    return '';
  }

  const topGenre = getGenresStat(films)[0][0];
  return topGenre;
};

const createStatisticsRankTemplate = ({
  avatar,
  rank
}) => (`<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>
`);

const createStatisticsFilterItemTemplate = (filter, currentFilterType) => {
  const {
    type,
    name
  } = filter;
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
    id="statistic-${type}" value="${type}"
    ${type === currentFilterType ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
  );
};

const createStatisticsFiltersTemplate = (filters, currentFilterType) => {
  // @todo: upper scope filter variable
  const filterItemsTemplate = filters.map((filter) => createStatisticsFilterItemTemplate(filter, currentFilterType)).join('');
  return (
    `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${filterItemsTemplate}
    </form>
`);
};

const createStatisticsGeneralInfoTemplate = (watchedFilmsCount, totalDuration, topGenre) => (`<ul class="statistic__text-list">
<li class="statistic__text-item">
  <h4 class="statistic__item-title">You watched</h4>
  <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
</li>
<li class="statistic__text-item">
  <h4 class="statistic__item-title">Total duration</h4>
  <p class="statistic__item-text">${totalDuration.hours} <span class="statistic__item-description">h</span> ${totalDuration.minutes}  <span class="statistic__item-description">m</span></p>
</li>
<li class="statistic__text-item">
  <h4 class="statistic__item-title">Top genre</h4>
  <p class="statistic__item-text">${topGenre}</p>
</li>
</ul>`);

const createStatisticsTemplate = (user, filters, currentFilter, watchedFilmsCount, totalDuration, topGenre) => (`<section class="statistic">
    ${createStatisticsRankTemplate(user)}
    ${createStatisticsFiltersTemplate(filters, currentFilter)}
    ${createStatisticsGeneralInfoTemplate(watchedFilmsCount, totalDuration, topGenre)}
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`);
export default class StatisticsPageView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #allWatchedFilms = null;
  #byPeriodWatchedFilms = null;

  /**
   * @params {Array} allWatchedFilms
   * @params {Array} byPeriodWatchedFilms
   * @params {String} currentFilter
   * @constructor
   */
  constructor(allWatchedFilms, byPeriodWatchedFilms, currentFilter) {
    super();
    this.#currentFilter = currentFilter;
    this.#allWatchedFilms = allWatchedFilms;
    this.#byPeriodWatchedFilms = byPeriodWatchedFilms;
    this.#filters = [
      {
        type: PeriodType.ALL_TIME,
        name: 'All time',
      },
      {
        type: PeriodType.TODAY,
        name: 'Today',
      },
      {
        type: PeriodType.WEEK,
        name: 'Week',
      },
      {
        type: PeriodType.MONTH,
        name: 'Month',
      },
      {
        type: PeriodType.YEAR,
        name: 'Year',
      },
    ];

    this.#setCharts();
  }

  get template() {
    const user = {
      avatar: 'images/bitmap@2x.png',
      rank: getUserRank(this.#allWatchedFilms.length)
    };

    const watchedFilmsCount = this.#byPeriodWatchedFilms.length;
    const totalDuration = runtimeToDuration(this.#byPeriodWatchedFilms.reduce((totalMinutes, film) => (totalMinutes + film.duration), 0));

    const topGenre = getTopGenre(this.#byPeriodWatchedFilms);
    return createStatisticsTemplate(user, this.#filters, this.#currentFilter, watchedFilmsCount, totalDuration, topGenre);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterChange = callback;
    this.element.querySelectorAll('.statistic__filters-input').forEach((element) => {
      element.addEventListener('change', this.#filterChangeHandler);
    });
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterChange(evt.target.value);
  }

  #setCharts = () => {
    const films = this.#byPeriodWatchedFilms;
    const genresStat = getGenresStat(films);
    const genres = genresStat.map((genre) => genre[0]);
    const genresCounts = genresStat.map((genre) => genre[1]);
    const BAR_HEIGHT = 50;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    statisticCtx.height = BAR_HEIGHT * genres.length;

    new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: genres,
        datasets: [{
          data: genresCounts,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });

  }
}
