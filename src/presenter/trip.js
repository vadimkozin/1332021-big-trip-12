import SortView from '../view/sort';
import TripDaysView from '../view/trip-days';
import TripDaysItemView from '../view/trip-days-item';
import DayInfoView from '../view/day-info';
import TripEventsListView from '../view/trip-events-list';
import NoRouteView from '../view/no-route';
import PointPresenter from './point';
import {SortType, UpdateType, UserAction} from '../const';
import {render, remove} from '../utils/render';
import {setOrdinalDaysRoute, getDaysRoute, sortPrice, sortTime, sortDays} from '../utils/route';
import {bindHandlers} from "../utils/common.js";

export default class Trip {
  constructor(tripContainer, models) {
    const {pointsModel, offersModel, citiesModel} = models;
    this._pointsModel = pointsModel;
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;
    this._pointPresenter = {};

    this._sortComponent = new SortView();
    this._tripDaysComponent = new TripDaysView();
    this._tripDaysItemComponent = new TripDaysItemView();
    this._tripEventsListComponent = new TripEventsListView();
    this._noTripComponent = new NoRouteView();
    this._dayWithoutInfoComponent = new DayInfoView({isDayWithoutInfo: true});

    this._setHandlers();
  }

  _setHandlers() {
    this._handlers = {};

    this._handlers.sortTypeChange = (sortType) => {
      if (this._currentSortType === sortType) {
        return;
      }

      this._sortTrip(sortType);
      this._clearTripList();
      this._renderTripList(sortType);
    };

    this._handlers.tripChange = (updatedPoint) => {
      this._points = this._pointsModel.update(UpdateType.MAJOR, updatedPoint).points;
      this._pointPresenter[updatedPoint.id].init(updatedPoint);
    };

    this._handlers.modeChange = () => {
      Object
        .values(this._pointPresenter)
        .forEach((presenter) => presenter.resetView());
    };

    this._handlers.viewAction = (actionType, updateType, update) => {
      console.log(`viewAction:`, actionType, updateType);

      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this._pointsModel.update(updateType, update);
          break;
        case UserAction.ADD_POINT:
          this._pointsModel.add(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          this._pointsModel.delete(updateType, update);
          break;
      }
    };

    this._handlers.modelEvent = (updateType, data) => {
      console.log(`modelEvent:`, updateType, data.isFavorite);

      this._points = this._pointsModel.points;

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
    this._points = this._pointsModel.points;

    this._pointsModel.addObserver(this._handlers.modelEvent);

    this._setHandlerSort();
    this._renderTrip();
  }

  destroy() {
    this._clear({resetSortType: true});

    remove(this._tripEventsListComponent);

    this._pointsModel.removeObserver(this._handlers.modelEvent);
  }

  _renderTrip() {
    if (!this._points.length) {
      this._renderNoTrip();
      return;
    }

    setOrdinalDaysRoute(this._points); // мутирую

    render(this._tripContainer, this._sortComponent);
    this._renderTripList(SortType.DEFAULT);
  }

  _renderTripList(typeSort) {
    if (typeSort === SortType.DEFAULT) {
      this._renderTripByDays();
      return;
    }

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
    // const pointPresenter = new PointPresenter(container, this._handlers.tripChange, this._handlers.modeChange);
    const pointPresenter = new PointPresenter(container, this._handlers.viewAction, this._handlers.modeChange);

    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderNoTrip() {
    render(this._tripContainer, this._noTripComponent);
  }

  _sortTrip(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortPrice);
        break;
      default:
        this._points.sort(sortDays);
        break;
    }

    this._currentSortType = sortType;
  }

  _setHandlerSort() {
    this._sortComponent.setSortTypeChangeHandler(this._handlers.sortTypeChange);
  }

  _clearTripList() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._tripDaysItemComponent.getElement().innerHTML = ``;
    this._tripEventsListComponent.getElement().innerHTML = ``;
  }

  _clear({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    // remove(this._sortComponent);
    // remove(this._noTripComponent);
    remove(this._tripDaysComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

}
