import AbstractView from './abstract';

const createNoRouteTemplate = () =>
  `<p class="trip-events__msg">Click New Event to create your first point</p>`;

export default class NoRoute extends AbstractView {
  getTemplate() {
    return createNoRouteTemplate();
  }
}
