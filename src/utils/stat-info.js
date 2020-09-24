import moment from 'moment';
import {Offer} from '../const';
import {ucFirst} from './common';

const makeItemsUniq = (items) => [...new Set(items)];

const calcTotalSumma = (points) => points.reduce((sum, it) => sum + it.price, 0);

const calcTotalDuration = (points) => {
  return points.reduce((duration, point) =>
    duration + (point.endDate.getTime() - point.startDate.getTime())
  , 0);
};

const objectToArray = (object) => Object.entries(object).map(([key, value]) => ({[key]: value}));

const sortObjectByValues = (object, sortDescending = true) => {
  const array = objectToArray(object);

  return array.sort((itemA, itemB) => {
    const a = Object.entries(itemA);
    const b = Object.entries(itemB);

    return sortDescending
      ? Number(b[0][1]) - Number(a[0][1])
      : Number(a[0][1]) - Number(b[0][1]);
  });
};

export default class StatInfo {
  constructor(points) {
    this._points = points;
    this._totalCost = 0;

    this._money = {};
    this._transport = {};
    this._timeSpend = {};

    this._calcMoney();
    this._calcTransport();
    this._calcTimeSpend();
  }

  getMoney() {
    const sortedTypesByValue = sortObjectByValues(this._money);
    const types = sortedTypesByValue.map((type) => Object.keys(type)[0]);
    const costs = types.map((type) => this._money[type]);

    return {
      types: types.map((type) => ucFirst(type)),
      costs,
      count: types.length,
      total: this._totalCost,
    };
  }

  getTransport() {
    const transports = sortObjectByValues(this._transport);
    const vehicles = transports.map((vehicle) => Object.keys(vehicle)[0]);
    const numberTrips = vehicles.map((vehicle) => this._transport[vehicle]);

    return {
      vehicles: vehicles.map((vehicle) => ucFirst(vehicle)),
      numberTrips,
      count: vehicles.length,
    };
  }

  getTimeSpend() {
    const sortedTypesByValue = sortObjectByValues(this._timeSpend);
    const types = sortedTypesByValue.map((type) => Object.keys(type)[0]);
    const durations = types.map((type) => this._timeSpend[type]);
    const durationsInHours = durations.map((it) => Math.round(moment.duration(it).asHours()));

    return {
      types: types.map((type) => ucFirst(type)),
      durations,
      durationsInHours,
      count: types.length,
    };
  }

  _calcMoney() {
    const types = makeItemsUniq(this._points.map((point) => point.type));

    this._money = types.reduce((acc, type) => {
      const pointsByType = this._points.filter((point) => point.type === type);

      const cost = calcTotalSumma(pointsByType);
      this._totalCost += cost;

      return Object.assign(acc, {[type]: cost});
    }, {});
  }

  _calcTransport() {
    const vehicles = this._points
      .filter((point) => Offer.TRANSFERS.includes(point.type))
      .map((point) => point.type);

    this._transport = vehicles.reduce((acc, vehicle) => {
      const countType = this._points.reduce((count, point) => point.type === vehicle ? count + 1 : count, 0);
      return Object.assign(acc, {[vehicle]: countType});
    }, {});
  }

  _calcTimeSpend() {
    const types = makeItemsUniq(this._points.map((point) => point.type));

    this._timeSpend = types.reduce((acc, type) => {
      const pointsByType = this._points.filter((point) => point.type === type);

      const duration = calcTotalDuration(pointsByType);

      return Object.assign(acc, {[type]: duration});
    }, {});
  }
}

