import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import SortView from './view/sort';
import TripDaysView from './view/trip-days';
import TripDaysItemView from './view/trip-days-item';
import DayInfoView from './view/day-info';
import TripEventsListView from './view/trip-events-list';
import TripEventsItemView from './view/trip-events-item';
import TripEditFirstView from './view/trip-edit-first';
import TripInfoView from './view/trip-info';
import NoRouteView from './view/no-route';
import {generateRoute} from './mock/route';
import {render, replace, RenderPosition} from './utils/render';
import {getRouteInfo, setOrdinalDaysRoute, getDaysRoute} from './utils/route';
import {Mock, ESCAPE_CODE} from './const';

const {EVENT: {VEHICLE: {NAMES: vehicleNames}, PLACE: {NAMES: placeNames}}, DESTINATIONS: cities} = Mock;
const ROUTE_POINT_COUNT = 20;

const points = Array(ROUTE_POINT_COUNT).fill().map(generateRoute);

const renderPoint = (container, point) => {

  const pointComponent = new TripEventsItemView(point);
  const pointEditComponent = new TripEditFirstView(point, cities, vehicleNames, placeNames);

  const onEscKeyDown = (evt) => {
    if (evt.keyCode === ESCAPE_CODE) {
      evt.preventDefault();
      replace(pointComponent, pointEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replace(pointEditComponent, pointComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replace(pointComponent, pointEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, pointComponent);
};

if (!points.length) {
  render(document.querySelector(`.trip-events`), new NoRouteView().getElement());
} else {

  setOrdinalDaysRoute([...points]);

  const routeInfo = getRouteInfo(points);
  const days = getDaysRoute(points);

  const siteTripMainElement = document.querySelector(`.trip-main`);
  const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
  const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
  const siteTripEventsElement = document.querySelector(`.trip-events`);

  render(siteTripMainElement, new TripInfoView(routeInfo), RenderPosition.AFTER_BEGIN);

  render(siteMenuElement, new SiteMenuView(), RenderPosition.AFTER_END);

  render(siteFilterElement, new FilterView(), RenderPosition.AFTER_END);

  render(siteTripEventsElement, new SortView());

  // элементы маршрута
  const tripDaysElement = new TripDaysView().getElement();
  render(siteTripEventsElement, tripDaysElement);

  days.forEach((day) => {
    // точки за день
    const pointsOfDay = points.filter((point) => point.order === day);

    // начинаем очередной день
    render(tripDaysElement, new TripDaysItemView());

    const tripDaysItemElement = tripDaysElement.querySelector(`.trip-days__item:nth-child(${day})`);

    // инфо по дню
    render(tripDaysItemElement, new DayInfoView(day, pointsOfDay[0].startDate));

    // контейнер для точек маршрута в текущем дне
    const tripListElement = new TripEventsListView();

    render(tripDaysItemElement, tripListElement);

    // отрисовываем все точки маршрута текущего дня
    pointsOfDay.forEach((point) => {
      renderPoint(tripListElement, point);
    });
  });
}
