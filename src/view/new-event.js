import AbstractView from './abstract';

const createNewEventTemplate = () =>
  `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;

export default class NewEvent extends AbstractView {
  getTemplate() {
    return createNewEventTemplate();
  }

  _newEventHandler(evt) {
    evt.preventDefault();
    this._callback.newEventClick();
  }

  setNewEventHandler(callback) {
    this._callback.newEventClick = callback;
    this.getElement().addEventListener(`click`, this._newEventHandler);
  }
}
