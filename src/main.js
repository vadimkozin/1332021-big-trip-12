import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TripInfoView from './view/trip-info';
import {generateRoute} from './mock/route';
import {render, RenderPosition} from './utils/render';
import {getRouteInfo} from './utils/route';
import TripPresenter from './presenter/trip';

const ROUTE_POINT_COUNT = 21;

const points = Array(ROUTE_POINT_COUNT).fill().map(generateRoute);
const routeInfo = getRouteInfo(points);

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView(routeInfo), RenderPosition.AFTER_BEGIN);

render(siteMenuElement, new SiteMenuView(), RenderPosition.AFTER_END);

render(siteFilterElement, new FilterView(), RenderPosition.AFTER_END);

new TripPresenter(siteTripEventsElement).init(points);
