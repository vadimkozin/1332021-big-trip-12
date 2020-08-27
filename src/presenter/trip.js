import SortView from '../view/sort';
import TripDaysView from '../view/trip-days';
import TripDaysItemView from '../view/trip-days-item';
import DayInfoView from '../view/day-info';
import TripEventsListView from '../view/trip-events-list';
import NoRouteView from '../view/no-route';
import PointPresenter from './point';
import {updateItem} from '../utils/common';
import {SortType} from '../const';
import {render} from '../utils/render';
import {setOrdinalDaysRoute, getDaysRoute, sortPrice, sortTime} from '../utils/route';

export default class Trip {
  constructor(tripConatainer) {
    this._tripContainer = tripConatainer;
    this._currentSortType = SortType.DEFAULT;
    this._pointPresenter = {};

    this._sortComponent = new SortView();
    this._tripDaysComponent = new TripDaysView();
    this._tripDaysItemComponent = new TripDaysItemView();
    this._tripEventsListComponent = new TripEventsListView();
    this._noTripComponent = new NoRouteView();
    this._dayWithoutInfoComponent = new DayInfoView({isDayWithoutInfo: true});

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleTripChange = this._handleTripChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._defaultPoints = points.slice();

    this._setHandlerSort();
    this._renderTrip();
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
    const pointPresenter = new PointPresenter(container, this._handleTripChange, this._handleModeChange);
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
        this._points = this._defaultPoints.slice();
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTrip(sortType);
    this._clearTripList();
    this._renderTripList(sortType);
  }

  _setHandlerSort() {
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearTripList() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._tripDaysItemComponent.getElement().innerHTML = ``;
    this._tripEventsListComponent.getElement().innerHTML = ``;
  }

  _handleTripChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._defaultPoints = updateItem(this._defaultPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

}
