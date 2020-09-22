import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentFilter) => {
  let isChecked = ``;
  const isDisabled = filter.count === 0 ? `disabled` : ``;

  if (!isDisabled) {
    isChecked = filter.name.toLowerCase() === currentFilter.toLowerCase() ? `checked` : ``;
  }

  return `<div class="trip-filters__filter">
            <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${isChecked} ${isDisabled}>
            <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.type}</label>
          </div>`;

};

const createFilterTemplate = (currentFilter, filters) => {
  const itemsFilter = filters.map((filter) => createFilterItemTemplate(filter, currentFilter)).join(``);

  return `<form class="trip-filters" action="#" method="get">
            ${itemsFilter}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {
  constructor(currentFilter, filters) {
    super();
    this._currentFilter = currentFilter;
    this._filters = filters;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._currentFilter, this._filters);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.type !== `radio`) {
      return;
    }

    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  turnOff(filterName) {
    const element = this.getElement().querySelector(`#filter-${filterName}`);
    element.setAttribute(`disabled`, `disabled`);
    element.removeAttribute(`checked`);
  }

}
