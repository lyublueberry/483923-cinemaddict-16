import {render, RenderPosition, remove} from '../utils/render.js';
import StatisticsPageView from '../view/statistics-page-view.js';


export default class StaticticPresenter  {
  #statisticComponent = new StatisticsPageView();


  constructor() {

  }


  init = () => {

  }

  destroy = ()=> {
    remove(this.#statisticComponent);
  }
}
