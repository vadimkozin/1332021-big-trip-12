import AbstractView from './abstract';
import {formatDate as format} from '../utils/common';
import {getEventType} from '../utils/route';
import {getOffersByType} from '../mock/route';

const createEventList = (events, typeEvent) =>
  events.map((event) => {
    const eventLower = event.toLowerCase();
    const checked = event === typeEvent ? `checked` : ``;

    return `<div class="event__type-item">
      <input id="event-type-${eventLower}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventLower}" ${checked}>
      <label class="event__type-label  event__type-label--${eventLower}" for="event-type-${eventLower}-1">${event}</label>
      </div>`;
  }).join(``);

const createCityList = (cities) =>
  cities.map((city) => `<option value="${city}"></option>`).join(``);

const getPlaceholder = (type) => getEventType(type);

const createSectionOffers = (point) => {

  if (!point.offers.length) {
    return ``;
  }

  const offers = getOffersByType(point.type);

  if (!offers.length) {
    return ``;
  }

  const offerList = offers.map((offer) => {
    const nameLower = offer.name.toLowerCase();
    const checked = point.offers.find((offerSelected) => offerSelected.name === offer.name) ? `checked` : ``;

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${nameLower}-1" type="checkbox" name="event-offer-${nameLower}" ${checked}>
        <label class="event__offer-label" for="event-offer-${nameLower}-1">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }).join(``);

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${offerList}</div>
    </section>`;
};

const createTripEditTemplate = (point, cities, eventsTransfer, eventsActivity) => {
  const favoriteChecked = point.isFavorite ? `checked` : ``;

  return `<form class="event  event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${createEventList(eventsTransfer, point.type)}
        </fieldset>

        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
          ${createEventList(eventsActivity, point.type)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        <!-- Flight to -->
        ${getPlaceholder(point.type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.destination}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createCityList(cities)}
        <!--
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
        -->
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <!-- <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25"> -->
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${format.dmy(point.startDate)}">

      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <!-- <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35"> -->
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${format.dmy(point.endDate)}">

    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>

    <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteChecked}>
    <label class="event__favorite-btn" for="event-favorite-1">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>

  <section class="event__details">
    ${createSectionOffers(point)}
  <!--
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
          <label class="event__offer-label" for="event-offer-luggage-1">
            <span class="event__offer-title">Add luggage</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">30</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
          <label class="event__offer-label" for="event-offer-comfort-1">
            <span class="event__offer-title">Switch to comfort class</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">100</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
          <label class="event__offer-label" for="event-offer-meal-1">
            <span class="event__offer-title">Add meal</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">15</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
          <label class="event__offer-label" for="event-offer-seats-1">
            <span class="event__offer-title">Choose seats</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">5</span>
          </label>
        </div>

        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
          <label class="event__offer-label" for="event-offer-train-1">
            <span class="event__offer-title">Travel by train</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">40</span>
          </label>
        </div>
      </div>
    </section>
    -->
  </section>
</form>`;
};

export default class TripEdit extends AbstractView {
  constructor(point, cities, eventsTransfer, eventsActivity) {
    super();

    this._point = point;
    this._cities = cities;
    this._eventsTransfer = eventsTransfer;
    this._eventsActivity = eventsActivity;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHander = this._favoriteClickHander.bind(this);
  }

  getTemplate() {
    return createTripEditTemplate(
        this._point, this._cities, this._eventsTransfer, this._eventsActivity);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit();
  }

  _favoriteClickHander(evt) {
    console.log(`trip-edit._favoriteClickHander:`, evt);
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHander(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, this._favoriteClickHander);

  }
}
