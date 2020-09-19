import he from 'he';
import AbstractView from './abstract';
import {replaceStr as replace} from '../utils/common';

const createTripInfoTemplate = (info) =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <!--<h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>-->
      <h1 class="trip-info__title">${replace(info.nameRoute)}</h1>

      <!--<p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>-->
      <p class="trip-info__dates">${replace(info.duration)}</p>

    </div>

    <p class="trip-info__cost">
      <!--Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>-->
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${info.total}</span>
    </p>
  </section>`;

export default class TripInfo extends AbstractView {
  constructor(info) {
    super();
    this._info = info ? info : null;
  }

  set info(info) {
    this._info = info;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
  }

  set totalSumma(total) {
    document.querySelector(`.trip-info__cost-value`).textContent = total;
  }

  init(info) {
    this._info = info;
    this.totalSumma = info.total;

    document.querySelector(`.trip-info__title`).textContent = he.decode(replace(info.nameRoute));
    document.querySelector(`.trip-info__dates`).textContent = he.decode(replace(info.duration));
  }
}
