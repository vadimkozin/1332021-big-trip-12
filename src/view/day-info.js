import {createElement, formatDate as format} from '../utils';

export const createDayInfoTemplate = (dayInOrder, date) =>
  `<div class="day__info">
    <span class="day__counter">${dayInOrder}</span>
    <time class="day__date" datetime="${format.ymd(date)}">${format.md(date)}</time>
  </div>`;

export default class SiteMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createDayInfoTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

}
