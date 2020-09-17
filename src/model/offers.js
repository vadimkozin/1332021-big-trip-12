export default class Offers {
  constructor(offers) {
    this._offers = offers ? offers.slice() : null;
  }

  set offers(offers) {
    this._offers = offers.slice();
  }

  get offers() {
    return this._offers;
  }

  getByType(type) {
    return this._offers.filter((offer) => offer.type === type);
  }

}
