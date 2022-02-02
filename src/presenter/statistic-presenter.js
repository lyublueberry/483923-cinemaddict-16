import {render, RenderPosition, remove, replace} from '../utils/render.js';
import StatisticsPageView from '../view/statistics-page-view.js';


export default class StaticticPresenter  {
  #statisticComponent = null;
  #statisticContainer = null;
  #films = null;
  #filmsModel = null;


  constructor(statisticContainer, filmsModel) {
    this.#statisticContainer = statisticContainer;
    this.#filmsModel = filmsModel;
    console.log(filmsModel);

  }


  init = () => {
    const prevStatisticComponent = this.#statisticComponent;
    this.#statisticComponent = new StatisticsPageView(this.#filmsModel);
    if(prevStatisticComponent === null){
      render(this.#statisticContainer, this.#statisticComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this.#statisticComponent, prevStatisticComponent);
    remove(prevStatisticComponent);
  }

  destroy = ()=> {
    if(this.#statisticComponent === null){
      return;
    }
    remove(this.#statisticComponent);
  }
}
