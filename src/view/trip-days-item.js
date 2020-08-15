import {createElement} from "../utils.js";

const createTripDaysItemTemplate = () => `<li class="trip-days__item day"></li>`;

export default class TripDaysItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysItemTemplate();
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
