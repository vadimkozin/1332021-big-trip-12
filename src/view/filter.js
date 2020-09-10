import AbstractView from './abstract';
import {FilterType} from '../const';

const createFilterItemTemplate = (filter, currentFilter) => {
  const isChecked = filter.toLowerCase() === currentFilter.toLowerCase() ? `checked` : ``;
  const name = filter.toLowerCase();

  return `<div class="trip-filters__filter">
            <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked}>
            <label class="trip-filters__filter-label" for="filter-${name}">${filter}</label>
          </div>`;

};

const createFilterTemplate = (currentFilter) => {
  const itemsFilter =
    Object
      .values(FilterType)
      .map((filter) => createFilterItemTemplate(filter, currentFilter)).join(``);

  return `<form class="trip-filters" action="#" method="get">
            ${itemsFilter}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {
  constructor(currentFilter) {
    super();
    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    console.log(evt.target.value + ` .`);

    if (evt.target.type !== `radio`) {
      return;
    }

    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

}
