import Observer from '../utils/observer';
import {FilterType} from '../const';


export default class Filter extends Observer {
  constructor() {
    super();
    this._active = FilterType.EVERYTHING;
  }

  setFilter(updateType, filter) {
    this._active = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._active;
  }
}
