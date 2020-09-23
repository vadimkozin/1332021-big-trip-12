import TripEventsItemView from '../view/trip-events-item';
import TripEditView from '../view/trip-edit';
import {render, replace, remove} from '../utils/render';
import {ESCAPE_CODE, Offer, UserAction, UpdateType} from '../const';
import {bindHandlers} from "../utils/common";


const Mode = {
  DEFAULT: `DEFAULT`,
  EDITTING: `EDITTING`,
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`,
  DEFAULT: `DEFAULT`
};

export default class Point {
  constructor(pointContainer, changeData, changeMode, models) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._models = models;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._setHandlers();
  }

  init(point, isRedraw = true) {
    this._point = point;

    if (!isRedraw) {
      return;
    }

    this._initSavePrev();

    this._pointComponent = new TripEventsItemView(point);
    this._pointEditComponent = new TripEditView({point, eventsTransfer: Offer.TRANSFERS, eventsActivity: Offer.ACTIVITIES, isNewPoint: false, models: this._models});

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

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._pointEditComponent.reset(this._point);
      this._replaceFormToView();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        flags: {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          flags: {
            isDisabled: true,
            isSaving: true
          }
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          flags: {
            isDisabled: true,
            isDeleting: true
          }
        });
        break;
      case State.DEFAULT:
        this._pointEditComponent.updateData({
          flags: {
            isDisabled: false,
            isDeleting: false,
            isSaving: false
          }
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _initSavePrev() {
    this._prev = {
      pointComponent: this._pointComponent,
      pointEditComponent: this._pointEditComponent,
    };
  }

  _initSetHandlers() {
    this._pointComponent.setEditClickHandler(this._handlers.editClick);
    this._pointEditComponent.setFormSubmitHandler(this._handlers.formSubmit);
    this._pointEditComponent.setFavoriteClickHander(this._handlers.favoriteClick);
    this._pointEditComponent.setFormDeleteHandler(this._handlers.formDelete);
    this._pointEditComponent.setFormCloseHandler(this._handlers.formClose);
  }

  _initIsFirstCall() {
    return !Object.values(this._prev).every(Boolean);
  }

  _initReplaceComponent() {
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, this._prev.pointComponent);
    }

    if (this._mode === Mode.EDITTING) {
      replace(this._pointComponent, this._prev.pointEditComponent);
      this._mode = Mode.DEFAULT;
    }
  }

  _initRemovePrev() {
    Object.keys(this._prev).forEach((component) => {
      remove(this._prev[component]);
      this._prev[component] = null;
    });
  }

  _replaceViewToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._handlers.escKeyDown);
    this._changeMode();
    this._mode = Mode.EDITTING;
  }

  _replaceFormToView() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._handlers.escKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _setHandlers() {
    this._handlers = {};

    this._handlers.editClick = () => {
      this._replaceViewToForm();
    };

    this._handlers.favoriteClick = () => {
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
    };

    this._handlers.formSubmit = (point) => {
      this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    };

    this._handlers.escKeyDown = (evt) => {
      if (evt.keyCode === ESCAPE_CODE) {
        evt.preventDefault();
        this._pointEditComponent.reset(this._point);
        this._replaceFormToView();
      }
    };

    this._handlers.formDelete = (point) => {
      this._changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
    };

    this._handlers.formClose = (point) => {
      this._pointEditComponent.reset(point);
      this._replaceFormToView();
    };

    bindHandlers(this._handlers, this);
  }

}
