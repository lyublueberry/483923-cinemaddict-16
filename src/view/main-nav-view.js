import AbstractView from './abstract-view.js';

const createMainNavTemplate = () => (`<nav class="main-navigation">
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`
);

export default class MainNavView extends AbstractView {
  get template() {
    return createMainNavTemplate();
  }
}
