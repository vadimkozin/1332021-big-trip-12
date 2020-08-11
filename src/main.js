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
import {generateRoute} from './mock/route';
import {getRouteInfo, setOrdinalDaysRoute, getDaysRoute} from './utils';
import {createNoRouteTemplate} from './view/no-route';
import {Param} from './mock/param';

const ROUTE_POINT_COUNT = 10;

const Position = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
};

const route = Array(ROUTE_POINT_COUNT).fill().map(() => generateRoute());

const render = (container, template, position = Position.BEFORE_END) => {
  container.insertAdjacentHTML(position, template);
};

const renderRoute = (points) => {

  if (points.length < 2) { // 2 так как 1-я точка по ТЗ зарезервирована под Форму редактирования
    render(document.querySelector(`.trip-events`), createNoRouteTemplate());
    return;
  }

  console.log(points);
  // ТЗ: данные первого по порядку элемента массива -> в Форму редактирования
  const pointFirst = points[0];

  // ТЗ: остальные данные в массиве для точек маршрута:
  points = points.slice(1);
  console.log(points);

  setOrdinalDaysRoute(points);

  const routeInfo = getRouteInfo(points);
  console.log(routeInfo);
  const days = getDaysRoute(points);
  console.log(days);


  const siteTripMainElement = document.querySelector(`.trip-main`);
  const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
  const siteTripEventsElement = document.querySelector(`.trip-events`);
  const siteSortElement = siteTripEventsElement.querySelector(`h2`);

  render(siteTripMainElement, createTripAndCostTemplate(routeInfo), Position.AFTER_BEGIN);
  render(siteMenuElement, createSiteMenuTemplate(), Position.AFTER_END);
  render(siteFilterElement, createFilterTemplate(), Position.AFTER_END);
  render(siteSortElement, createSortTemplate(), Position.AFTER_END);

  // форма добавления нового события
  // ТЗ: данные первого по порядку элемента массива -> в Форму редактирования
  // point, eventsTransfer, eventsActivity
  const names1 = Param.Event.Vehicle.NAMES;
  const names2 = Param.Event.Place.NAMES;
  const cities = Param.DESTINATIONS;

  render(siteSortElement, createAddFirstEventTemplate(pointFirst, cities, names1, names2), Position.AFTER_END);

  // элементы маршрута
  render(siteTripEventsElement, createTripDaysTemplate()); // `<ul class="trip-days"></ul>`

  const tripDaysElement = siteTripEventsElement.querySelector(`.trip-days`);

  days.forEach((day) => {
    // точки за день
    const pointsOfDay = points.filter((it) => it.order === day);

    // начинаем очередной день
    render(tripDaysElement, createTripDaysItemTemplate()); // `<li class="trip-days__item day"></li>`

    const tripDaysItemElement = tripDaysElement.querySelector(`.trip-days__item:nth-child(${day})`);

    // инфо по дню
    render(tripDaysItemElement, createDayInfoTemplate(day, pointsOfDay[0].date1));

    // контейнер для точек маршрута в текущем дне
    render(tripDaysItemElement, createTripEventsListTemplate()); // `<ul class="trip-events__list"></ul>`;

    const tripListElement = tripDaysItemElement.querySelector(`.trip-events__list`);

    // отрисовываем все точки маршрута текущего дня
    pointsOfDay.forEach((point) => {
      render(tripListElement, createTripEventsItemTemplate(point)); // <li class="trip-events__item">
    });

  });

};

renderRoute(route);
