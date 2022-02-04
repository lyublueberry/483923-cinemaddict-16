import {FilterType, PeriodType} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import StatisticsPageView from '../view/statistics-page-view.js';

/**
 * Создаёт презентер статистики.
 * @class
 */
export default class StaticticPresenter  {
  /** @type { StatisticsPageView } */
  #statisticComponent = null;
  /** @type {HTMLElement} */
  #statisticContainer = null;
  /** @type { FilmsModel } */
  #filmsModel = null;
  #filterType = PeriodType.ALL_TIME;

  /**
   * @param {HTMLElement} statisticContainer
   * @param {FilmsModel} filmsModel
   */
  constructor(statisticContainer, filmsModel) {
    this.#statisticContainer = statisticContainer;
    this.#filmsModel = filmsModel;
  }

  /**
   * Все фильмы
   */
  get allFilms () {
    return this.#filmsModel.films;
  }

  /**
   * Все просмотренные фильмы
   */
  get allWatchedFilms () {
    return filter[FilterType.HISTORY](this.allFilms);
  }

  /**
   * Фильмы просмотренные за выбранный период
   */
  get byPeriodWatchedFilms() {
    return filter[this.#filterType](this.allWatchedFilms);
  }

  /**
   * Инициализация презентера
   */
  init = () => {
    /** @type { StatisticsPageView } */
    this.#statisticComponent = new StatisticsPageView(
      this.allWatchedFilms,
      this.byPeriodWatchedFilms,
      this.#filterType
    );
    this.#statisticComponent.setFilterChangeHandler(this.#handleFilterTypeChange);
    render(this.#statisticContainer, this.#statisticComponent, RenderPosition.BEFOREEND);
  }


  /**
   * Очистка презентера
   */
  destroy = ()=> {
    if (this.#statisticComponent === null){
      return;
    }

    remove(this.#statisticComponent);
  }

  #updateView = () => {
    const prevStatisticComponent = this.#statisticComponent;
    this.#statisticComponent = new StatisticsPageView(
      this.allWatchedFilms,
      this.byPeriodWatchedFilms,
      this.#filterType
    );
    this.#statisticComponent.setFilterChangeHandler(this.#handleFilterTypeChange);
    replace(this.#statisticComponent, prevStatisticComponent);
    remove(prevStatisticComponent);

  }

  #handleFilterTypeChange = (value) => {
    this.#filterType = value;
    this.#updateView();
  }
}
