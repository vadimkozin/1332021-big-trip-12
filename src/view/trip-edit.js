import flatpicker from 'flatpickr';
import SmartView from './smart';
import {formatDate as format, getDateFrom} from '../utils/common';
import StoreItems from '../utils/common';
import {getEventType} from '../utils/route';
import {getOffersByType, getDestinationByName} from '../mock/route';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/material_blue.css';
import '../../public/css/add.css';

const Smart = {
  EVENT_TYPE: `_type`,
  DESTINATION: `_destination`,
  START_DATE: `_startDate`,
  END_DATE: `_endDate`,
  PRICE: `_price`,
  OFFERS: `_offers`,
  DESCRIPTION: `_description`,
  PHOTOS: `_photos`,
};

const configDatepicker = {
  dateFormat: `d/m/Y H:i`,
  time_24hr: true,
  enableTime: true,
  defaultDate: null, // this._data.startDate,
  onChange: null, // this._handlers.startDate
};

const getDatepicker = ({element, config = configDatepicker, defaultDate = null, onChange = function () {}} = {}) => {
  return flatpicker(element,
      Object.assign({}, config, {defaultDate, onChange}));
};

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

const getPlaceholder = (point) => point._type ? getEventType(point._type) : getEventType(point.type);

const getDestination = (point) => point._destination ? point._destination : point.destination;

const getPrice = (point) => point._price ? point._price : point.price;


const createSectionOffers = (point) => {

  const allOffersByType = point._type ? getOffersByType(point._type) : getOffersByType(point.type);

  const pointOffers = Array.isArray(point.offers) ? point.offers.slice() : [];

  const offers = Array.isArray(point._offers)
    ? point._offers.slice()
    : pointOffers;

  const offerList = allOffersByType.map((offer) => {
    const nameLower = offer.name.toLowerCase();
    const checked = offers.find((offerChecked) => offerChecked.name === offer.name) ? `checked` : ``;

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

  const title = offerList
    ? ` <h3 class="event__section-title  event__section-title--offers">Offers</h3>`
    : ``;

  return `
    <section class="event__section  event__section--offers">
     ${title}
      <div class="event__available-offers">${offerList}</div>
    </section>`;
};


const createSectionDestination = (point) => {
  const description = point._description ? point._description : point.description;
  const photos = point._photos ? point._photos : point.photos;
  const isPhotos = Boolean(photos.length);

  if (!(description && isPhotos)) {
    return ``;
  }

  let photosContainer = ``;

  if (isPhotos) {
    const photoList = photos.map((photo) =>
      `<img class="event__photo" src="${photo}" alt="Event photo"></img>`).join(``);

    photosContainer =
      `<div class="event__photos-container">
        <div class="event__photos-tape">
        ${photoList}
        </div>
      </div>`;
  }

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${photosContainer}
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
        ${getPlaceholder(point)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${getDestination(point)}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createCityList(cities)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${format.dmy(point.startDate)}">

      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${format.dmy(point.endDate)}">

    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${getPrice(point)}">
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
    ${createSectionDestination(point)}
  </section>
</form>`;
};


export default class TripEdit extends SmartView {
  constructor(point, cities, eventsTransfer, eventsActivity) {
    super();

    this._data = TripEdit.parsePointToData(point);
    this._cities = cities;
    this._eventsTransfer = eventsTransfer;
    this._eventsActivity = eventsActivity;

    this._storeOffers = new StoreItems(`name`, `price`).init(point.offers);

    this._datepicker = {};
    this._datepicker.start = null;
    this._datepicker.end = null;

    this._setHandlers();
    this._setInnerHandlers();
    this._setDatepicker();
  }

  reset(point) {
    this.updateData(TripEdit.parsePointToData(point));
  }

  getTemplate() {
    return createTripEditTemplate(
        this._data, this._cities, this._eventsTransfer, this._eventsActivity);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFavoriteClickHander(this._callback.favoriteClick);
    this._setDatepicker();
  }

  _setDatepicker() {
    Object.values(this._datepicker).forEach((datepicker) => {
      if (datepicker) {
        datepicker.destroy();
        datepicker = null;
      }
    });

    this._initializeDatePicker();
  }

  _initializeDatePicker() {
    this._datepicker.start = getDatepicker({
      element: this.getElement().querySelector(`input[name="event-start-time"]`),
      defaultDate: this._data.startDate,
      onChange: this._handlers.startDate,
    });

    this._datepicker.end = getDatepicker({
      element: this.getElement().querySelector(`input[name="event-end-time"]`),
      defaultDate: this._data.endDate,
      onChange: this._handlers.endDate,
    });

    this._datepicker.end.set(`minDate`, this._data.startDate);
  }

  _setHandlers() {
    this._handlers = {};

    this._handlers.formSubmit = (evt) => {
      evt.preventDefault();
      this._callback.formSubmit(TripEdit.parseDataToPoint(this._data));
    };

    this._handlers.favorite = (evt) => {
      evt.preventDefault();
      this._callback.favoriteClick();
    };

    this._handlers.type = (evt) => {
      evt.preventDefault();

      if (evt.target.nodeName !== `LABEL`) {
        return;
      }

      this._storeOffers.destroy();
      this.updateData({[Smart.OFFERS]: {}});
      this.updateData({[Smart.EVENT_TYPE]: evt.target.textContent});
    };

    this._handlers.destination = (evt) => {
      evt.preventDefault();

      if (evt.target.nodeName !== `INPUT`) {
        return;
      }

      const destination = evt.target.value;
      const description = getDestinationByName(destination).description;
      const photos = getDestinationByName(destination).photos;
      this.updateData({[Smart.DESCRIPTION]: description});
      this.updateData({[Smart.PHOTOS]: photos});
      this.updateData({[Smart.DESTINATION]: destination});
    };

    this._handlers.price = (evt) => {
      evt.preventDefault();
      this.updateData({[Smart.PRICE]: parseInt(evt.target.value, 10)}, true);
    };

    // this._handlers.startDate = (evt) => {
    //   evt.preventDefault();
    //   const date = getDateFrom(evt.target.value);
    //   this.updateData({[Smart.START_DATE]: date}, true);
    // };
    this._handlers.startDate = (selectedDates) => {

      const startDate = selectedDates[0];
      this.updateData({[Smart.START_DATE]: startDate}, true);

      const endDate = this._datepicker.end.selectedDates[0];

      if (endDate < startDate) {
        this._datepicker.end.setDate(startDate);
        this.updateData({[Smart.END_DATE]: startDate}, true);
      }

      this._datepicker.end.set(`minDate`, startDate);

    };

    // this._handlers.endDate = (evt) => {
    //   evt.preventDefault();
    //   const date = getDateFrom(evt.target.value);
    //   this.updateData({[Smart.END_DATE]: date}, true);
    // };

    this._handlers.endDate = (selectedDates) => {
      this.updateData({[Smart.END_DATE]: selectedDates[0]}, true);
    };

    this._handlers.offer = (evt) => {
      evt.preventDefault();

      let parent = null;

      if (evt.target.nodeName === `SPAN`) {
        parent = evt.target.parentElement;
      }

      if (evt.target.nodeName === `LABEL`) {
        parent = evt.target;
      }

      if (parent) {
        const name = parent.children[0].innerText;
        const price = parent.children[1].innerText;

        this._storeOffers.add(name, Number(price));
        this.updateData({[Smart.OFFERS]: this._storeOffers.getItems()});
      }
    };

    this._handlers.formSubmit = this._handlers.formSubmit.bind(this);
    this._handlers.favorite = this._handlers.favorite.bind(this);
    this._handlers.type = this._handlers.type.bind(this);
    this._handlers.destination = this._handlers.destination.bind(this);
    this._handlers.price = this._handlers.price.bind(this);
    this._handlers.startDate = this._handlers.startDate.bind(this);
    this._handlers.endDate = this._handlers.endDate.bind(this);
    this._handlers.offer = this._handlers.offer.bind(this);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`)
        .addEventListener(`click`, this._handlers.type);

    this.getElement().querySelector(`.event__input.event__input--destination`)
        .addEventListener(`change`, this._handlers.destination);

    this.getElement().querySelector(`.event__input.event__input--price`)
        .addEventListener(`input`, this._handlers.price);

    // this.getElement().querySelector(`input[name="event-start-time"]`)
    //     .addEventListener(`input`, this._handlers.startDate);

    // this.getElement().querySelector(`input[name="event-end-time"]`)
    //     .addEventListener(`input`, this._handlers.endDate);

    this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._handlers.offer);

  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._handlers.formSubmit);
  }

  setFavoriteClickHander(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, this._handlers.favorite);
  }

  static parsePointToData(point) {
    const getBlankSmartProperty = () =>
      Object.values(Smart).reduce((acc, prop) => Object.assign(acc, {[prop]: null}), {});

    return Object.assign(
        {},
        point,
        getBlankSmartProperty()
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    Object
      .values(Smart)
      .filter((property) => data[property])
      .forEach((property) => {
        const prop = property.slice(1);
        data[prop] = data[property];
        delete data[property];
      });

    return data;
  }
}
