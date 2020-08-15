import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import SortView from './view/sort';
import TripDaysView from './view/trip-days';
import TripDaysItemView from './view/trip-days-item';
import DayInfoView from './view/day-info';
import TripEventsListView from './view/trip-events-list';
import TripEventsItemView from './view/trip-events-item';
import AddFirstEventView from './view/add-first-event';
import TripInfoView from './view/trip-and-cost';
import NoRouteView from './view/no-route';
import {generateRoute} from './mock/route';
import {getRouteInfo, setOrdinalDaysRoute, getDaysRoute, render} from './utils';

import {Config} from './const';

const {POSITION: Position} = Config;

const Options = {
  ROUTE_POINT_COUNT: 33,
  POINTS_IN_ROUTE_MIN: 2, // 2 так как 1-я точка по ТЗ зарезервирована для Формы редактирования
};

const points = Array(Options.ROUTE_POINT_COUNT).fill().map(generateRoute);

if (points.length < Options.POINTS_IN_ROUTE_MIN) {
  render(document.querySelector(`.trip-events`), new NoRouteView().getElement());
} else {
  // ТЗ: данные первого по порядку элемента массива -> в Форму редактирования
  const pointFirst = points[0];

  // ТЗ: остальные данные в массиве для точек маршрута:
  const pointsRoute = points.slice(1);

  setOrdinalDaysRoute([...pointsRoute]);

  const routeInfo = getRouteInfo(pointsRoute);
  const days = getDaysRoute(pointsRoute);

  const siteTripMainElement = document.querySelector(`.trip-main`);
  const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
  const siteTripEventsElement = document.querySelector(`.trip-events`);

  render(siteTripMainElement, new TripInfoView(routeInfo).getElement(), Position.AFTER_BEGIN);

  render(siteMenuElement, new SiteMenuView().getElement(), Position.AFTER_END);

  render(siteFilterElement, new FilterView().getElement(), Position.AFTER_END);

  // ТЗ: данные первого по порядку элемента массива -> в Форму редактирования
  const {EVENT: {VEHICLE: {NAMES: vehicleNames}, PLACE: {NAMES: placeNames}}, DESTINATIONS: cities} = Config.MOCK;

  render(siteTripEventsElement, new AddFirstEventView(pointFirst, cities, vehicleNames, placeNames).getElement());

  render(siteTripEventsElement, new SortView().getElement());


  // форма добавления нового события

  // элементы маршрута
  const tripDaysElement = new TripDaysView().getElement();
  render(siteTripEventsElement, tripDaysElement);

  days.forEach((day) => {
    // точки за день
    const pointsOfDay = points.filter((point) => point.order === day);

    // начинаем очередной день
    render(tripDaysElement, new TripDaysItemView().getElement());

    const tripDaysItemElement = tripDaysElement.querySelector(`.trip-days__item:nth-child(${day})`);

    // инфо по дню
    render(tripDaysItemElement, new DayInfoView(day, pointsOfDay[0].date1).getElement());

    // контейнер для точек маршрута в текущем дне
    const tripListElement = new TripEventsListView().getElement();
    render(tripDaysItemElement, tripListElement);

    // отрисовываем все точки маршрута текущего дня
    pointsOfDay.forEach((point) => {
      render(tripListElement, new TripEventsItemView(point).getElement());

    });

  });

}
