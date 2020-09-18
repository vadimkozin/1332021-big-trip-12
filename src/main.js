import SiteMenuView from './view/site-menu';
import TripInfoView from './view/trip-info';
import StatView from './view/stat';
import LoadingView from './view/loading';
import {render, RenderPosition, remove} from './utils/render';
import {getRouteInfo} from './utils/route';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import {MenuItem, UpdateType, FilterType} from './const';
import Api from './api';

const AUTHORIZATION = `Basic qbdt45Urf&knPwsR5`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
let isLoading = true;

const api = new Api(END_POINT, AUTHORIZATION);

const models = {
  pointsModel: new PointsModel(),
  offersModel: new OffersModel(),
  filterModel: new FilterModel(),
  destinationsModel: new DestinationsModel(),
};

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteMenuElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:first-child`);
const siteFilterElement = siteTripMainElement.querySelector(`.trip-main__trip-controls h2:last-child`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

const siteMenuComponent = new SiteMenuView();
const tripInfoComponent = new TripInfoView();

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

const removeAny = (component) => {
  if (component) {
    remove(component);
  }
};

let statComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (isLoading) {
    return;
  }

  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      removeAny(statComponent);
      menuAddItem.disable();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.destroy();
      tripPresenter.init();
      models.filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.createPoint(menuAddItem.enable);
      break;
    case MenuItem.TABLE:
      removeAny(statComponent);
      tripPresenter.destroy();
      tripPresenter.init();
      siteMenuComponent.setMenuItem(menuItem);
      menuAddItem.enable();
      break;
    case MenuItem.STATS:
      siteMenuComponent.setMenuItem(menuItem);
      menuAddItem.enable();
      tripPresenter.destroy();
      statComponent = new StatView(models.pointsModel.points);
      render(siteTripEventsElement, statComponent);
      break;
  }
};

const btnNewEvent = siteTripMainElement.querySelector(`.trip-main__event-add-btn`);

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
siteMenuComponent.addMenuClickHandler(handleSiteMenuClick, btnNewEvent, MenuItem.ADD_NEW_EVENT);

menuAddItem.disable();
tripInfoComponent.info = getRouteInfo([]);
render(siteTripMainElement, tripInfoComponent, RenderPosition.AFTER_BEGIN);

const loadingComponent = new LoadingView();
render(siteTripEventsElement, loadingComponent);

render(siteMenuElement, siteMenuComponent, RenderPosition.AFTER_END);

filterPresenter.init();

Promise.all([api.getPoints(), api.getOffers(), api.getDestinations()]).then((response) => {
  const [points, offers, destinations] = [...response];

  remove(loadingComponent);
  menuAddItem.enable();
  isLoading = false;

  tripInfoComponent.init(getRouteInfo(points));

  models.pointsModel.points = points;
  models.offersModel.offers = offers;
  models.destinationsModel.destinations = destinations;

  render(siteTripMainElement, tripInfoComponent, RenderPosition.AFTER_BEGIN);
  render(siteMenuElement, siteMenuComponent, RenderPosition.AFTER_END);

  tripPresenter.init();

}).catch(alert);
