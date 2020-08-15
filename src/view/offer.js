import {createElement} from "../utils.js";
import {Config} from '../const';

const getHtmlOffers = (offers, max) => {
  let html = ``;

  for (let i = 0; i < Math.min(offers.length, max); i++) {
    html +=
    `<li class="event__offer">
      <span class="event__offer-title">${offers[i].name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offers[i].price}</span>
    </li>`;
  }

  return html;
};

export const createOfferTemplate = (offers) =>
  `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${getHtmlOffers(offers, Config.OFFERS_MAX)}
  </ul>`;

export default class SiteMenu {
  constructor(offers) {
    this._offers = offers;
    this._element = null;
  }

  getTemplate() {
    return createOfferTemplate(this._offers);
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

