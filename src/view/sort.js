import AbstractView from './abstract';
import {SortType} from '../const';

const getIcon = () => `
  <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
  </svg>`;

const getSortItem = (sort, currentSort) => {
  const isChecked = sort === currentSort ? `checked` : ``;
  const name = sort.split(`-`)[1]; // sort-price -> price
  const icon = sort === SortType.DEFAULT ? `` : getIcon();

  return `<div class="trip-sort__item  trip-sort__item--event">
            <input id="${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sort}" ${isChecked}>
            <label class="trip-sort__btn" for="${sort}">${name}${icon}</label>
          </div>\n`;
};

const createSortTemplate = (currentSort) => {
  const itemsSortTemplate = Object.values(SortType).map((sort) => getSortItem(sort, currentSort)).join(``);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">\n
      <span class="trip-sort__item  trip-sort__item--day">Day</span>\n
      ${itemsSortTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>\n
    </form>`;
};


export default class Sort extends AbstractView {
  constructor(currentSort) {
    super();
    this._currentSort = currentSort;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSort);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.type !== `radio`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.value);
  }
}
