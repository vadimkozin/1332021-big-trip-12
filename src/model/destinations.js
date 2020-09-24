export default class Destinations {
  constructor(_destinations) {
    this._destinations = _destinations ? _destinations.slice() : null;
  }

  set destinations(destinations) {
    this._destinations = destinations.slice();
  }

  get destinations() {
    return this._destinations;
  }

  get names() {
    return this._destinations.map((destination) => destination.name).sort();
  }

  getByName(name) {
    return this._destinations.find((destination) => destination.name === name);
  }

}
