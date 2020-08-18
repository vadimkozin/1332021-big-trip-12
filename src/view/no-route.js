import AbstractView from './abstract';

const createNoRouteTemplate = () =>
  `<h1 style="text-align:center;">Click New Event to create your first point</h1>`;

export default class NoRoute extends AbstractView {
  getTemplate() {
    return createNoRouteTemplate();
  }
}
