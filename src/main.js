import SiteMenuView from './view/site-menu';
import TripInfoView from './view/trip-info';
import {generateRoute, offers} from './mock/route';
import {render, RenderPosition} from './utils/render';
import {getRouteInfo} from './utils/route';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import OffersModel from './model/offers';
import CitiesModel from './model/cities';
import {Mock, MenuItem, UpdateType, FilterType} from './const';

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

const siteMenuComponent = new SiteMenuView();

render(siteTripMainElement, new TripInfoView(routeInfo), RenderPosition.AFTER_BEGIN);

render(siteMenuElement, siteMenuComponent, RenderPosition.AFTER_END);

const filterPresenter = new FilterPresenter(siteFilterElement, models.filterModel);
const tripPresenter = new TripPresenter(siteTripEventsElement, models);

const menuAddItem = {
  selector: `.trip-main__event-add-btn`,
  disable: () => {
    siteTripMainElement.querySelector(menuAddItem.selector).disabled = true;
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
  },
  enable: () => {
    siteTripMainElement.querySelector(menuAddItem.selector).disabled = false;
  },
};

const handleSiteMenuClick = (menuItem) => {
  console.log(menuItem);
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      menuAddItem.disable();
      tripPresenter.destroy();
      models.filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case MenuItem.TABLE:
      siteMenuComponent.setMenuItem(menuItem);
      menuAddItem.enable();
      break;
    case MenuItem.STATS:
      siteMenuComponent.setMenuItem(menuItem);
      menuAddItem.enable();
      break;
  }
};

const btnNewEvent = siteTripMainElement.querySelector(`.trip-main__event-add-btn`);

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
siteMenuComponent.addMenuClickHandler(handleSiteMenuClick, btnNewEvent, MenuItem.ADD_NEW_EVENT);

filterPresenter.init()
tripPresenter.init();
