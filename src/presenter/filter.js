import FilterView from "../view/filter";
import {render, replace, remove, RenderPosition} from '../utils/render';
import {UpdateType} from "../const.js";

export default class Filter {
  constructor(container, filterModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._currentFilter = null;

    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const prevComponent = this._component;
    this._component = new FilterView(this._currentFilter);
    this._component.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.AFTER_END);
      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}

