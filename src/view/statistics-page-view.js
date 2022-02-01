import AbstractView from './abstract-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { runtimeToDuration } from '../utils/film.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../utils/const.js';

const getTopGenre = (films) => {
  let genres = [];
  const genresList = {};
  films.forEach((film) => {
    genres = [...genres, ...film.genre];
  });
  const uniqeGenres = [...new Set(genres)];
  uniqeGenres.forEach((genre) => {
    genresList[genre] = genres.filter((val) => val === genre).length;
  });
  return Object.entries(genresList).sort((a, b) => b[1]-a[1]).shift()[0];
};

const createStatisticsRankTemplate = ({avatar, rank}) => (`<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>
`);

const createStatisticsFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name} = filter;
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
    id="statistic-${type}" value="${type}"
    ${type === currentFilterType ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
  );
};

const createStatisticsFiltersTemplate = (filters, currentFilterType) => {
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
  #filmsModel = null;

  constructor(filmsModel) {
    super();

    this.#filmsModel = filmsModel;
    this.#filters = [
      {
        type: 'all-time',
        name: 'All time',
      },
      {
        type: 'today',
        name: 'Today',
      },
      {
        type: 'week',
        name: 'Week',
      },
      {
        type: 'month',
        name: 'Month',
      },
      {
        type: 'year',
        name: 'Year',
      },];

      this.#currentFilter = 'week';
    this.#setCharts();
  }

  get template() {
    const user = {
      avatar: 'images/bitmap@2x.png',
      rank: 'Movie buff'
    };

    const watchedFilms = filter[FilterType.HISTORY](this.#filmsModel.films);
    const watchedFilmsCount = watchedFilms.length;
    const totalDuration = runtimeToDuration(watchedFilms.reduce((totalMinutes, film)=>(totalMinutes + film.duration), 0));

   const topGenre = getTopGenre(watchedFilms);
    return createStatisticsTemplate(user, this.#filters, this.#currentFilter, watchedFilmsCount, totalDuration, topGenre);
  }

  #setCharts = () => {
    const BAR_HEIGHT = 50;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    statisticCtx.height = BAR_HEIGHT * 5;

    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: ['Sci-Fi', 'Animation', 'Fantasy', 'Comedy', 'TV Series'],
        datasets: [{
          data: [11, 8, 7, 4, 3],
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
