import AbstractView from './abstract';

const createErrorTemplate = () => `<p class="trip-events__msg">Error access to server</p`;

export default class Error extends AbstractView {
  getTemplate() {
    return createErrorTemplate();
  }
}
