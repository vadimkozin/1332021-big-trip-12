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

class MenuAddItem {
  constructor(menuElement) {
    this._selector = `.trip-main__event-add-btn`;
    this._menuElement = menuElement;

    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }
  _getElement() {
    return this._menuElement.querySelector(this._selector);
  }
  disable() {
    this._getElement().disabled = true;
  }
  enable() {
    this._getElement().disabled = false;
  }
}

const menuAddItem = new MenuAddItem(siteTripMainElement);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      menuAddItem.disable();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.destroy();
      tripPresenter.init();
      models.filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.createPoint(menuAddItem.enable);
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

filterPresenter.init();
tripPresenter.init();
