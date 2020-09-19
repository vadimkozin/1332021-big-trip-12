import TripEditView from '../view/trip-edit';
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType, Flags} from "../const.js";
import {ESCAPE_CODE} from "../const";
import {Offer} from "../const";
import {POINT_BLANK} from "../utils/route";


export default class PointNew {
  constructor(contaiter, changeData, models) {
    this._contaiter = contaiter;
    this._changeData = changeData;
    this._models = models;

    this._pointEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormDelete = this._handleFormDelete.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new TripEditView(
        {point: POINT_BLANK,
          eventsTransfer: Offer.TRANSFERS, eventsActivity: Offer.ACTIVITIES, isNewPoint: true, models: this._models});

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setFormDeleteHandler(this._handleFormDelete);

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

  setSaving() {
    this._pointEditComponent.updateData({
      flags: {
        [Flags.isDisabled]: true,
        [Flags.isSaving]: true
      }
    });
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleFormDelete() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_CODE) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
