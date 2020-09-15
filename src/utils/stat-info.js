import moment from 'moment';
import {Mock} from '../const';
const {EVENT: {VEHICLE: {NAMES: vehicleNames}}} = Mock;


const makeItemsUniq = (items) => [...new Set(items)];

const calcTotalSumma = (points) => points.reduce((sum, it) => sum + it.price, 0);

const calcTotalDuration = (points) => {
  return points.reduce((duration, point) =>
    duration + (point.endDate.getTime() - point.startDate.getTime())
  , 0);
};

// {k1:v1, k2:v2, k3:v3} --> [{k1:v1}, {k2:v2}, {k3:v3}]
const objectToArray = (object) => Object.entries(object).map(([key, value]) => ({[key]: value}));

// [{a: 2}, {b: 15}, {c: 10}] -> [{b: 15}, {c: 10}, {a: 2}]
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
    this._totalCost2 = 0;

    this._totalDuration = 0;

    this._money = {};
    this._transport = {};
    this._timeSpend = {};

    this._calcMoney();
    this._calcTransport();
    this._calcTimeSpend();
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

  getMoney() {
    const sortedTypesByValue = sortObjectByValues(this._money);
    const types = sortedTypesByValue.map((type) => Object.keys(type)[0]);
    const costs = types.map((type) => this._money[type]);

    return {
      types,
      costs,
      count: types.length,
      total: this._totalCost,
    };
  }

  _calcTransport() {
    const vehicles = this._points
      .filter((point) => vehicleNames.includes(point.type))
      .map((point) => point.type);

    this._transport = vehicles.reduce((acc, vehicle) => {
      const countType = this._points.reduce((count, point) => point.type === vehicle ? count + 1 : count, 0);
      return Object.assign(acc, {[vehicle]: countType});
    }, {});
  }

  getTransport() {
    const transports = sortObjectByValues(this._transport);
    const vehicles = transports.map((vehicle) => Object.keys(vehicle)[0]);
    const numberTrips = vehicles.map((vehicle) => this._transport[vehicle]);

    return {
      vehicles,
      numberTrips,
      count: vehicles.length,
    };
  }

  _calcTimeSpend() {
    const types = makeItemsUniq(this._points.map((point) => point.type));

    this._timeSpend = types.reduce((acc, type) => {
      const pointsByType = this._points.filter((point) => point.type === type);

      const duration = calcTotalDuration(pointsByType);
      this._totalDuration += duration;

      return Object.assign(acc, {[type]: duration});
    }, {});
  }

  getTimeSpend() {
    const sortedTypesByValue = sortObjectByValues(this._timeSpend);
    const types = sortedTypesByValue.map((type) => Object.keys(type)[0]);
    const durations = types.map((type) => this._timeSpend[type]);
    const durationsInHours = durations.map((it) => Math.round(moment.duration(it).asHours()));

    return {
      types,
      durations,
      durationsInHours,
      count: types.length,
    };
  }
}

