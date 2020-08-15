import {createElement} from "../utils.js";

const createNoRouteTemplate = () =>
  `<h1 style="text-align:center;">Click New Event to create your first point</h1>`;

export default class NoRoute {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoRouteTemplate();
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
