import TripEventsItemView from '../view/trip-events-item';
import TripEditView from '../view/trip-edit';
import {render, replace, remove} from '../utils/render';
import {Mock, ESCAPE_CODE} from '../const';
import {UserAction, UpdateType} from "../const.js";

const {EVENT: {VEHICLE: {NAMES: vehicleNames}, PLACE: {NAMES: placeNames}}, DESTINATIONS: cities} = Mock;
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITTING: `EDITTING`
};

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, isRedraw = true) {
    this._point = point;

    if (!isRedraw) {
      return;
    }

    this._initSavePrev();

    this._pointComponent = new TripEventsItemView(point);
    this._pointEditComponent = new TripEditView(point, cities, vehicleNames, placeNames);

    this._initSetHandlers();

    if (this._initIsFirstCall()) {
      render(this._pointContainer, this._pointComponent);
      return;
    }

    this._initReplaceComponent();
    this._initRemovePrev();
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _initSavePrev() {
    this._prev = {
      pointComponent: this._pointComponent,
      pointEditComponent: this._pointEditComponent,
    };
  }

  _initSetHandlers() {
    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setFavoriteClickHander(this._handleFavoriteClick);
  }

  _initIsFirstCall() {
    return !Object.values(this._prev).every(Boolean);
  }

  _initReplaceComponent() {
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, this._prev.pointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._pointEditComponent, this._prev.pointEditComponent);
    }
  }

  _initRemovePrev() {
    Object.keys(this._prev).forEach((component) => {
      remove(this._prev[component]);
      this._prev[component] = null;
    });
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._pointEditComponent.reset(this._point);
      this._replaceFormToView();
    }
  }

  _replaceViewToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITTING;
  }

  _replaceFormToView() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.keyCode === ESCAPE_CODE) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToView();
    }
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    this._replaceFormToView();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }

  _handleEditClick() {
    this._replaceViewToForm();
  }

}

