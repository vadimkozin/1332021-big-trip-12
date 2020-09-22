import SortView from '../view/sort';
import TripDaysView from '../view/trip-days';
import TripDaysItemView from '../view/trip-days-item';
import DayInfoView from '../view/day-info';
import TripEventsListView from '../view/trip-events-list';
import NoRouteView from '../view/no-route';
import TripInfoView from "../view/trip-info";
import PointPresenter, {State as PointPresenterViewState} from './point';
import PointNewPresenter from './point-new';
import {SortType, UpdateType, UserAction} from '../const';
import {render, remove} from '../utils/render';
import {setOrdinalDaysRoute, getDaysRoute, sortPrice, sortTime, sortDays} from '../utils/route';
import {bindHandlers} from "../utils/common.js";
import {filter} from "../utils/filter";
import {getRouteInfo} from "../utils/route";

export default class Trip {
  constructor(tripContainer, models, api) {
    this._tripContainer = tripContainer;
    this._models = models;
    this._api = api;
    this._pointsModel = models.pointsModel;
    this._filterModel = models.filterModel;
    this._currentSortType = SortType.DEFAULT;
    this._pointPresenter = {};

    this._sortComponent = null;
    this._tripDaysComponent = new TripDaysView();
    this._tripDaysItemComponent = new TripDaysItemView();
    this._tripEventsListComponent = new TripEventsListView();
    this._noTripComponent = new NoRouteView();
    this._dayWithoutInfoComponent = new DayInfoView({isDayWithoutInfo: true});

    this._tripInfoComponent = new TripInfoView();

    this._setHandlers();

    this._tripEventsElement = document.querySelector(`.trip-events`);
    this._pointNewPresenter = new PointNewPresenter(this._tripEventsElement, this._handlers.viewAction, this._models);
  }

  _setHandlers() {
    this._handlers = {};

    this._handlers.sortTypeChange = (sortType) => {
      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this._clear();
      this._renderTrip();
    };

    this._handlers.modeChange = () => {
      Object
        .values(this._pointPresenter)
        .forEach((presenter) => presenter.resetView());
    };

    this._handlers.viewAction = (actionType, updateType, update) => {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
          this._api.updatePoint(update)
            .then((response) => {
              this._pointsModel.update(updateType, response);
              this._pointPresenter[update.id].setViewState(PointPresenterViewState.DEFAULT);
              this._updateInfoRoute();
            }).catch(() =>{
              this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
            });
          break;
        case UserAction.ADD_POINT:
          this._pointNewPresenter.setSaving();
          this._api.addPoint(update)
            .then((response) => {
              this._pointsModel.add(updateType, response);
              this._updateInfoRoute();
            })
            .catch(() => {
              this._pointNewPresenter.setAborting();
            });
          break;
        case UserAction.DELETE_POINT:
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
          this._api.deletePoint(update)
            .then(() => {
              this._pointsModel.delete(updateType, update);
              this._updateInfoRoute();
            })
            .catch(() => {
              this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
            });
          break;
      }
    };

    this._handlers.modelEvent = (updateType, data) => {
      switch (updateType) {
        case UpdateType.PATCH:
          this._pointPresenter[data.id].init(data, false);
          break;
        case UpdateType.MINOR:
          this._clear();
          this._renderTrip();
          break;
        case UpdateType.MAJOR:
          this._clear({resetSortType: true});
          this._renderTrip();
          break;
      }
    };

    bindHandlers(this._handlers, this);
  }

  init() {
    this._pointsModel.addObserver(this._handlers.modelEvent);
    this._filterModel.addObserver(this._handlers.modelEvent);
    this._renderTrip();
  }

  destroy() {
    this._clear({resetSortType: true});

    remove(this._tripEventsListComponent);

    this._pointsModel.removeObserver(this._handlers.modelEvent);
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
  }

  _updateInfoRoute() {
    this._tripInfoComponent.init(getRouteInfo(this._pointsModel.points));
  }

  _renderTrip() {
    this._points = this._getPoints();

    // обновление стоимости маршрута
    this._tripInfoComponent.totalSumma = getRouteInfo(this._points).total;

    if (!this._points.length) {
      this._renderNoTrip();
      return;
    }

    this._renderSort();

    this._renderTripList(this._currentSortType);
  }

  _renderTripList(typeSort) {
    if (typeSort === SortType.DEFAULT) {
      this._renderTripByDays();
      return;
    }

    // элементы маршрута
    render(this._tripContainer, this._tripDaysComponent);

    // день
    render(this._tripDaysComponent, this._tripDaysItemComponent);
    render(this._tripDaysItemComponent, this._dayWithoutInfoComponent);

    // контейнер для точек маршрута
    render(this._tripDaysItemComponent, this._tripEventsListComponent);

    // точки маршрута
    this._points.forEach((point) => {
      this._renderPoint(this._tripEventsListComponent, point);
    });
  }

  _renderTripByDays() {
    setOrdinalDaysRoute(this._points); // мутирую

    const days = getDaysRoute(this._points);

    // элементы маршрута
    const tripDaysElement = this._tripDaysComponent.getElement();

    render(this._tripContainer, this._tripDaysComponent);

    days.forEach((day) => {
      // точки за день
      const pointsOfDay = this._points.filter((point) => point.order === day);

      // день
      render(tripDaysElement, new TripDaysItemView());

      const tripDaysItemElement = tripDaysElement.querySelector(`.trip-days__item:nth-child(${day})`);

      // инфо по дню
      render(tripDaysItemElement, new DayInfoView({date: pointsOfDay[0].startDate, dayInOrder: day}));

      // контейнер для точек маршрута за текущий день
      const tripListElement = new TripEventsListView();

      render(tripDaysItemElement, tripListElement);

      // точки маршрута за день
      pointsOfDay.forEach((point) => {
        this._renderPoint(tripListElement, point);
      });
    });
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(container, this._handlers.viewAction, this._handlers.modeChange, this._models);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderNoTrip() {
    render(this._tripContainer, this._noTripComponent);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.points;
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        filtredPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        filtredPoints.sort(sortPrice);
        break;
      default:
        filtredPoints.sort(sortDays);
        break;
    }

    return filtredPoints;
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handlers.sortTypeChange);
    render(this._tripContainer, this._sortComponent);
  }

  _clearTripList() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._tripDaysItemComponent.getElement().innerHTML = ``;
    this._tripEventsListComponent.getElement().innerHTML = ``;
  }

  _clear({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    if (this._sortComponent) {
      remove(this._sortComponent);
    }

    if (this._noTripComponent) {
      remove(this._noTripComponent);
    }

    if (this._tripDaysComponent) {
      remove(this._tripDaysComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

}
