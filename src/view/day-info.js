import {createElement, formatDate as format} from '../utils';

const createDayInfoTemplate = (dayInOrder, date) =>
  `<div class="day__info">
    <span class="day__counter">${dayInOrder}</span>
    <time class="day__date" datetime="${format.ymd(date)}">${format.md(date)}</time>
  </div>`;

export default class DayInfo {
  constructor(dayInOrder, date) {
    this._dayInOrder = dayInOrder;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createDayInfoTemplate(this._dayInOrder, this._date);
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
