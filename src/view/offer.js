import {Atom as cfg} from '../utils';

export const createOfferTemplate = (offers) =>
  `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${getHtmlOffers(offers, cfg.OFFERS_MAX)}
  </ul>`;

function getHtmlOffers(offers, max) {
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
}

/* Original:
  `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    <li class="event__offer">
      <span class="event__offer-title">Order Uber</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">20</span>
    </li>
  </ul>`;

*/
