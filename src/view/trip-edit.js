import flatpicker from 'flatpickr';
import SmartView from './smart';
import {formatDate as format} from '../utils/common';
import StoreItems from '../utils/common';
import {getEventType} from '../utils/route';
import {bindHandlers, getNumber} from '../utils/common';

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
  IS_FAVORITE: `_isFavorite`,
};

const configDatepicker = {
  "dateFormat": `d/m/Y H:i`,
  "time_24hr": true,
  "enableTime": true,
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

const getType = (point) => point[Smart.EVENT_TYPE] ? point[Smart.EVENT_TYPE] : point.type;

const getPlaceholder = (point) => point[Smart.EVENT_TYPE] ? getEventType(point[Smart.EVENT_TYPE]) : getEventType(point.type);

const getDestinationName = (point) => point[Smart.DESTINATION] ? point[Smart.DESTINATION].name : point.destination.name;

const getPrice = (point) => point[Smart.PRICE] ? point[Smart.PRICE] : point.price;

const getStartDate = (point) => point[Smart.START_DATE] ? point[Smart.START_DATE] : point.startDate;

const getEndDate = (point) => point[Smart.END_DATE] ? point[Smart.END_DATE] : point.endDate;

const getStartDateFormat = (point) => format.dmy(getStartDate(point));

const getEndDateFormat = (point) => format.dmy(getEndDate(point));

const getIsFavorite = (point) => {
  if (point[Smart.IS_FAVORITE] !== null) {
    return point[Smart.IS_FAVORITE];
  } else {
    return point.isFavorite;
  }
};

const createSectionOffers = (point, offersModel) => {

  const allOffersByType = point._type ? offersModel.getByType(point._type) : offersModel.getByType(point.type);

  const pointOffers = Array.isArray(point.offers) ? point.offers.slice() : [];

  const offers = Array.isArray(point._offers)
    ? point._offers.slice()
    : pointOffers;

  const offerList = allOffersByType.map((offer) => {
    const nameLower = offer.title.toLowerCase();
    const checked = offers.find((offerChecked) => offerChecked.title === offer.title) ? `checked` : ``;

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${nameLower}-1" type="checkbox" name="event-offer-${nameLower}" ${checked}>
        <label class="event__offer-label" for="event-offer-${nameLower}-1">
          <span class="event__offer-title">${offer.title}</span>
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
  const description = point[Smart.DESTINATION] ? point[Smart.DESTINATION].description : point.destination.description;
  const photos = point[Smart.DESTINATION] ? point[Smart.DESTINATION].pictures : point.destination.pictures;
  const isPhotos = Boolean(photos.length);

  if (!(description && isPhotos)) {
    return ``;
  }

  let photosContainer = ``;

  if (isPhotos) {
    const photoList = photos.map((photo) =>
      `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`).join(``);

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


const createTripEditTemplate = (point, eventsTransfer, eventsActivity, isNewPoint, models) => {
  const favoriteChecked = getIsFavorite(point) ? `checked` : ``;
  const isNewEvent = isNewPoint ? `trip-events__item` : ``;
  const isHidden = isNewPoint ? `style="display: none"` : ``;
  const btnName = isNewPoint ? `Cancel` : `Delete`;

  return `<form class="${isNewEvent} event  event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${getType(point).toLowerCase()}.png" alt="Event type icon">
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
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${getDestinationName(point)}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createCityList(models.destinationsModel.names)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getStartDateFormat(point)}">

      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getEndDateFormat(point)}">

    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${getPrice(point)}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">${btnName}</button>

    <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favoriteChecked}>
    <label class="event__favorite-btn" for="event-favorite-1" ${isHidden}>
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>

    <button class="event__rollup-btn" type="button" ${isHidden}>
      <span class="visually-hidden">Open event</span>
    </button>
  </header>

  <section class="event__details">
    ${createSectionOffers(point, models.offersModel)}
    ${createSectionDestination(point)}
  </section>
</form>`;
};


export default class TripEdit extends SmartView {
  constructor({point, eventsTransfer, eventsActivity, isNewPoint = false, models} = {}) {
    super();
    this._models = models;
    this._isNewPoint = isNewPoint;
    this._data = TripEdit.parsePointToData(point);
    this._eventsTransfer = eventsTransfer;
    this._eventsActivity = eventsActivity;

    this._storeOffers = new StoreItems(`title`, `price`).init(point.offers);

    this._datepicker = {
      start: null,
      end: null
    };

    this._setHandlers();
    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();
    this._destroyDatepicker();
  }

  reset(point) {
    this.updateData(TripEdit.parsePointToData(point));
  }

  getTemplate() {
    return createTripEditTemplate(
        this._data, this._eventsTransfer, this._eventsActivity, this._isNewPoint, this._models);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormDeleteHandler(this._callback.formDelete);
    this.setFavoriteClickHander(this._callback.favoriteClick);
    this._setDatepicker();
  }

  _setDatepicker() {
    this._destroyDatepicker();
    this._initializeDatePicker();
  }

  _destroyDatepicker() {
    Object.values(this._datepicker).forEach((datepicker) => {
      if (datepicker) {
        datepicker.destroy();
        datepicker = null;
      }
    });
  }

  _initializeDatePicker() {
    this._datepicker.start = getDatepicker({
      element: this.getElement().querySelector(`input[name="event-start-time"]`),
      defaultDate: getStartDate(this._data),
      onChange: this._handlers.startDate,
    });

    this._datepicker.end = getDatepicker({
      element: this.getElement().querySelector(`input[name="event-end-time"]`),
      defaultDate: getEndDate(this._data),
      onChange: this._handlers.endDate,
    });

    this._datepicker.end.set(`minDate`, this._data.startDate);
  }

  _validation() {
    const destinationElement = this.getElement().querySelector(`input[name="event-destination"]`);
    const cityInput = destinationElement.value;

    const isCityValid = Boolean(this._models.destinationsModel.names.find((city) => city === cityInput));

    if (!isCityValid) {
      destinationElement.focus();
    }
    return isCityValid;
  }

  _setHandlers() {
    this._handlers = {};

    this._handlers.formSubmit = (evt) => {
      evt.preventDefault();
      if (this._validation()) {
        this._callback.formSubmit(TripEdit.parseDataToPoint(this._data));
      }
    };

    this._handlers.formDelete = (evt) => {
      evt.preventDefault();
      this._callback.formDelete(this._data);
    };

    this._handlers.favorite = (evt) => {
      evt.preventDefault();
      this.updateData({[Smart.IS_FAVORITE]: evt.target.checked});
      this._callback.favoriteClick();
    };

    this._handlers.type = (evt) => {
      evt.preventDefault();

      if (evt.target.nodeName !== `LABEL`) {
        return;
      }

      this._storeOffers.destroy();

      this.updateData({
        [Smart.OFFERS]: [],
        [Smart.EVENT_TYPE]: evt.target.textContent,
      });
    };

    this._handlers.destination = (evt) => {
      evt.preventDefault();

      if (evt.target.nodeName !== `INPUT`) {
        return;
      }

      if (this._validation()) {
        this.updateData({
          [Smart.DESTINATION]: this._models.destinationsModel.getByName(evt.target.value)
        });
      }
    };

    this._handlers.price = (evt) => {
      evt.preventDefault();
      this.updateData({[Smart.PRICE]: getNumber(evt.target.value)}, true);
    };

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

    bindHandlers(this._handlers, this);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`)
        .addEventListener(`click`, this._handlers.type);

    this.getElement().querySelector(`.event__input.event__input--destination`)
        .addEventListener(`change`, this._handlers.destination);

    this.getElement().querySelector(`.event__input.event__input--price`)
        .addEventListener(`input`, this._handlers.price);

    this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._handlers.offer);

  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._handlers.formSubmit);
  }

  setFormDeleteHandler(callback) {
    this._callback.formDelete = callback;
    this.getElement().addEventListener(`reset`, this._handlers.formDelete);
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
      .filter((property) => data[property] !== null)
      .forEach((property) => {
        const prop = property.slice(1);
        data[prop] = data[property];
      });

    Object.values(Smart).forEach((property) => delete data[property]);

    return data;
  }
}
