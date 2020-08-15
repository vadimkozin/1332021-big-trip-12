import {createElement, getEventTitle, formatDate as format, getTimeAndDuration as duration} from '../utils';
import {createOfferTemplate} from './offer';

const createTripEventsItemTemplate = (point) =>
  `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <!-- <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon"> -->
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type.toLowerCase()}.png" alt="Event type icon">

        </div>
      <!-- <h3 class="event__title">Taxi to Amsterdam</h3> -->
      <h3 class="event__title">${getEventTitle(point.type, point.destination)}</h3>


      <div class="event__schedule">
        <p class="event__time">
        <!--
          <time class="event__start-time" datetime="2019-03-18T10:30">10:30</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">11:00</time>
        -->

          <time class="event__start-time" datetime="${format.ymdhm(point.date1)}">${format.hm(point.date1)}</time>
          &mdash;
          <time class="event__start-time" datetime="${format.ymdhm(point.date2)}">${format.hm(point.date2)}</time>

        </p>
        <!-- <p class="event__duration">30M</p> -->
        <p class="event__duration">${duration(point.date1, point.date2).duration}</p>

      </div>

      <p class="event__price">
        <!-- &euro;&nbsp;<span class="event__price-value">20</span> -->
        &euro;&nbsp;<span class="event__price-value">${point.price}</span>

      </p>

      <!--
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">Order Uber</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">20</span>
        </li>
      </ul>
      -->

      ${point.offers.length ? createOfferTemplate(point.offers) : ``}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;

export default class TripEventsItem {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createTripEventsItemTemplate(this._point);
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
