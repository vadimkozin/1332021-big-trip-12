import AbstractView from './abstract';
import {getEventTitle, getTimeAndDuration as duration} from '../utils/route';
import {formatDate as format} from '../utils/common';
import {createOfferTemplate} from './offer';

const createTripEventsItemTemplate = (point) =>
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${getEventTitle(point.type, point.destination.name)}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${format.ymdhm(point.startDate)}">${format.hm(point.startDate)}</time>
          &mdash;
          <time class="event__start-time" datetime="${format.ymdhm(point.endDate)}">${format.hm(point.endDate)}</time>
        </p>
        <p class="event__duration">${duration(point.startDate, point.endDate).duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.price}</span>
      </p>

      ${point.offers.length ? createOfferTemplate(point.offers) : ``}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;

export default class TripEventsItem extends AbstractView {
  constructor(point) {
    super();

    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventsItemTemplate(this._point);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

}
