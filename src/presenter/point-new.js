import uniqueId from 'lodash.uniqueid';
import TripEditView from '../view/trip-edit';
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {ESCAPE_CODE} from "../const";
import {Mock} from "../const";
import {POINT_BLANK} from "../mock/route";


const {EVENT: {VEHICLE: {NAMES: vehicleNames}, PLACE: {NAMES: placeNames}}, DESTINATIONS: cities} = Mock;

export default class PointNew {
  constructor(contaiter, changeData) {
    this._contaiter = contaiter;
    this._changeData = changeData;

    this._pointEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new TripEditView(
        {point: Object.assign({}, POINT_BLANK),
          cities, eventsTransfer: vehicleNames, eventsActivity: placeNames, isNewPoint: true});

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setFormDeleteHandler(this._handleDeleteClick);

    render(this._contaiter, this._pointEditComponent, RenderPosition.AFTER_BEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        Object.assign({id: uniqueId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_CODE) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
