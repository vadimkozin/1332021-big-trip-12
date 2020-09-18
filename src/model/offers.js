import {Offer} from '../const';

export default class Offers {
  constructor(offers) {
    this._offers = offers ? Offers.setTypePoint(offers.slice()) : null;
  }

  set offers(offers) {
    this._offers = Offers.setTypePoint(offers.slice());
  }

  get offers() {
    return this._offers;
  }

  getByType(type) {
    return this._offers.find((offer) => offer.type === type.toLowerCase()).offers;
  }

  getTypes() {
    return this._offers.map((offer) => offer.type);
  }

  getTransferTypes() {
    return this._offers.filter((offer) => offer.isTransfer).map((offer) => offer.type);
  }

  getNoTransferTypes() {
    return this._offers.filter((offer) => !offer.isTransfer).map((offer) => offer.type);
  }

  static setTypePoint(offers) {
    return offers.map((offer) => Object.assign({}, offer, {isTransfer: Offers.isTransfer(offer.type)}));
  }

  static isTransfer(name) {
    return Boolean(Offer.TRANSFERS.find((transfer) => transfer === name.toLowerCase()));
  }
}
