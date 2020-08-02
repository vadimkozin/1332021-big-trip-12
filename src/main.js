import {createSiteMenuTemplate} from './view/site-menu';
import {createFilterTemplate} from './view/filter';
import {createSortTemplate} from './view/sort';
import {createTripDaysTemplate} from './view/trip-days';
import {createTripDaysItemTemplate} from './view/trip-days-item';
import {createDayInfoTemplate} from './view/day-info';
import {createTripEventsListTemplate} from './view/trip-events-list';
import {createTripEventsItemTemplate} from './view/trip-events-item';
import {createAddFirstEventTemplate} from './view/add-first-event';
import {createTripAndCostTemplate} from './view/trip-and-cost';

const ROUTE_POINT_COUNT = 3;

const Position = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
};

const render = (container, template, position = Position.BEFORE_END) => {
  container.insertAdjacentHTML(position, template);
};

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
const siteTripEventsElement = document.querySelector(`.trip-events`);
const siteSortElement = siteTripEventsElement.querySelector(`h2`);

render(siteTripMainElement, createTripAndCostTemplate(), Position.AFTER_BEGIN);
render(siteMenuElement, createSiteMenuTemplate(), Position.AFTER_END);
render(siteFilterElement, createFilterTemplate(), Position.AFTER_END);
render(siteSortElement, createSortTemplate(), Position.AFTER_END);
render(siteSortElement, createAddFirstEventTemplate(), Position.AFTER_END);

// элементы маршрута
render(siteTripEventsElement, createTripDaysTemplate());

const tripDaysItemElement = siteTripEventsElement.querySelector(`.trip-days`);

render(tripDaysItemElement, createTripDaysItemTemplate());
render(tripDaysItemElement, createDayInfoTemplate());
render(tripDaysItemElement, createTripEventsListTemplate());

const tripListElement = siteTripEventsElement.querySelector(`.trip-events__list`);

for (let i = 0; i < ROUTE_POINT_COUNT; i++) {
  render(tripListElement, createTripEventsItemTemplate());
}
