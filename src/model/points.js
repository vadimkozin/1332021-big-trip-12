import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor(points) {
    super();
    this._points = points.slice();
  }

  set points(points) {
    this._points = points.slice();
  }

  get points() {
    return this._points;
  }

  update(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);

    return this;
  }

  add(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);

    return this;
  }

  delete(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);

    return this;
  }
}
