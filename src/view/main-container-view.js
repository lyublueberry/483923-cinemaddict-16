import AbstractView from './abstract-view.js';

export default class MainContainerView extends AbstractView {
  get template() {
    return '<main class="main"> </main>';
  }
}
