const createFilterItemTemplate = (filters) => filters.map((filter) => (
  `<a href="#${filter.name}" class="main-navigation__item"> ${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`

));
export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = createFilterItemTemplate(filters).join('');

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};
