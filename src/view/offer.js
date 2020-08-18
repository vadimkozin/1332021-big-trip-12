import AbstractView from './abstract';
import {OFFERS_MAX} from '../const';

const getHtmlOffers = (offers, max) =>
  offers
    .slice(0, Math.min(offers.length, max))
    .map((offer) => {
      return `<li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`;
    }).join(``);

export const createOfferTemplate = (offers) =>
  `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${getHtmlOffers(offers, OFFERS_MAX)}
  </ul>`;

export default class SiteMenu extends AbstractView {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  getTemplate() {
    return createOfferTemplate(this._offers);
  }
}

