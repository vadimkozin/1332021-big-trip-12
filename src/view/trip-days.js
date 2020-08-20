import AbstractView from './abstract';

const createTripDaysTemplate = () => `<ul class="trip-days"></ul>`;

export default class TripDays extends AbstractView {
  getTemplate() {
    return createTripDaysTemplate();
  }
}
