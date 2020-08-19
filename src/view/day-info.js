import AbstractView from './abstract';
import {formatDate} from '../utils/common';

const createDayInfoTemplate = (dayInOrder, date) =>
  `<div class="day__info">
    <span class="day__counter">${dayInOrder}</span>
    <time class="day__date" datetime="${formatDate.ymd(date)}">${formatDate.md(date)}</time>
  </div>`;

const createDayWithoutInfoTemplate = () => `<div class="day__info"></div>`;

export default class DayInfo extends AbstractView {
  constructor({dayInOrder, date, isDayWithoutInfo = false} = {}) {
    super();

    this.isDayWithoutInfo = isDayWithoutInfo;
    this._dayInOrder = dayInOrder;
    this._date = date;
  }

  getTemplate() {
    // return createDayInfoTemplate(this._dayInOrder, this._date);
    return this.isDayWithoutInfo
      ? createDayWithoutInfoTemplate()
      : createDayInfoTemplate(this._dayInOrder, this._date);
  }
}
