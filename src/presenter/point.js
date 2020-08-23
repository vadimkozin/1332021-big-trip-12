import TripEventsItemView from '../view/trip-events-item';
import TripEditFirstView from '../view/trip-edit-first';
import {render, replace} from '../utils/render';
import {Mock, ESCAPE_CODE} from '../const';

const {EVENT: {VEHICLE: {NAMES: vehicleNames}, PLACE: {NAMES: placeNames}}, DESTINATIONS: cities} = Mock;

export default class Point {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;
    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init(point) {
    this._point = point;
    this._pointComponent = new TripEventsItemView(point);
    this._pointEditComponent = new TripEditFirstView(point, cities, vehicleNames, placeNames);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._pointContainer, this._pointComponent);

  }

  _replaceViewToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToView() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_CODE) {
      evt.preventDefault();
      this._replaceFormToView();
    }
  }

  _handleFormSubmit() {
    this._replaceFormToView();
  }

  _handleEditClick() {
    this._replaceViewToForm();
  }


}

/*
_renderPoint(container, point) {
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
}
}
*/
