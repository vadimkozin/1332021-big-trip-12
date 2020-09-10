import SiteMenuView from './view/site-menu';
import TripInfoView from './view/trip-info';
import NewEventView from './view/new-event';
import {generateRoute, offers} from './mock/route';
import {render, RenderPosition} from './utils/render';
import {getRouteInfo} from './utils/route';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import OffersModel from './model/offers';
import CitiesModel from './model/cities';
import {Mock} from './const';

const ROUTE_POINT_COUNT = 9;

const points = Array(ROUTE_POINT_COUNT).fill().map(generateRoute);
const routeInfo = getRouteInfo(points);


const models = {
  pointsModel: new PointsModel(points),
  offersModel: new OffersModel(offers),
  citiesModel: new CitiesModel(Mock.DESTINATIONS),
  filterModel: new FilterModel(),
};

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView(routeInfo), RenderPosition.AFTER_BEGIN);

render(siteTripMainElement, new NewEventView());

render(siteMenuElement, new SiteMenuView(), RenderPosition.AFTER_END);

new FilterPresenter(siteFilterElement, models.filterModel).init();

new TripPresenter(siteTripEventsElement, models).init();
