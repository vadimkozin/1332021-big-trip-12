import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor(points) {
    super();

    this._points = points ? points.slice() : null;
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

  static adaptToClient(point) {
    const adapted = Object.assign(
        {},
        point,
        {
          startDate: point.date_from !== null ? new Date(point.date_from) : point.date_from,
          endDate: point.date_to !== null ? new Date(point.date_to) : point.date_to,
          price: point.base_price !== null ? point.base_price : 0,
          isFavorite: point.is_favorite !== null ? point.is_favorite : false,
        }
    );

    delete adapted.date_from;
    delete adapted.date_to;
    delete adapted.base_price;
    delete adapted.is_favorite;

    return adapted;
  }

  static adaptToServer(point) {
    const adapted = Object.assign(
        {},
        point,
        {
          "date_from": point.startDate instanceof Date ? point.startDate.toISOString() : null,
          "date_to": point.endDate instanceof Date ? point.endDate.toISOString() : null,
          "base_price": point.price,
          "is_favorite": point.isFavorite,
        }
    );

    delete adapted.startDate;
    delete adapted.endDate;
    delete adapted.price;
    delete adapted.isFavorite;

    return adapted;
  }
}
