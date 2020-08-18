import AbstractView from './abstract';

const createTripDaysItemTemplate = () => `<li class="trip-days__item day"></li>`;

export default class TripDaysItem extends AbstractView {
  getTemplate() {
    return createTripDaysItemTemplate();
  }
}
