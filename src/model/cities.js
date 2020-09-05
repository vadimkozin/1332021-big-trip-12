export default class Cities {
  constructor(cities) {
    this._cities = cities.slice();
  }

  set cities(cities) {
    this._cities = cities.slice();
  }

  get cities() {
    return this._cities;
  }
}
