import AbstractView from './abstract-view.js';

export default class MessageFilmsListEmptyView extends AbstractView {
  get template() {
    return '<h2 class="films-list__title">There are no movies in our database</h2>';
  }
}
