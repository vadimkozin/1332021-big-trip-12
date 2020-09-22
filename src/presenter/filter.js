import FilterView from "../view/filter";
import {render, replace, remove, RenderPosition} from '../utils/render';
import {FilterType, UpdateType} from "../const.js";
import {filter} from "../utils/filter";


export default class Filter {
  constructor(container, filterModel, pointsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._currentFilter = null;

    this._component = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();

    if (!this._isRedraw(filters)) {
      return;
    }

    const prevComponent = this._component;

    this._component = new FilterView(this._currentFilter, filters);
    this._component.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.AFTER_END);
      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _isRedraw(filters) {
    const filterInfo = filters.find((filterItem) => filterItem.type === this._currentFilter);

    if (filterInfo.count === 0) {
      if (this._component) {
        filters.filter((filterItem) => filterItem.count === 0)
          .forEach((filterItem) => {
            this._component.turnOff(filterItem.name);
          });
      }

      if (this._currentFilter !== FilterType.EVERYTHING) {
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      }
      return false;
    }

    return true;
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

  _getFilters() {
    const points = this._pointsModel.points;

    return Object.values(FilterType).map((type) =>
      ({
        type,
        name: type,
        count: filter[type](points).length
      })
    );
  }
}

