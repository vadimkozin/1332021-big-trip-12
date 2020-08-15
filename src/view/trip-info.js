import {createElement, replaceStr as replace} from '../utils';

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

export default class TripInfo {
  constructor(info) {
    this._info = info;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
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
