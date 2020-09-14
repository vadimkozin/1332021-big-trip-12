import AbstractView from './abstract';
import {MenuItem} from "../const";

const createSiteMenuTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn" href="#" name="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
  <a class="trip-tabs__btn" href="#" name="${MenuItem.STATS}">${MenuItem.STATS}</a>
  </nav>`;

export default class SiteMenu extends AbstractView {
  constructor(defaultItem = MenuItem.TABLE) {
    super();

    this._defaultItem = defaultItem;
    this._active = `trip-tabs__btn--active`;
    this._nameAddMenuItem = null;

    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._addMenuClickHandler = this._addMenuClickHandler.bind(this);

    this.setMenuItem(this._defaultItem);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.name);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _addMenuClickHandler(evt) {
    evt.preventDefault();
    this._callback.addMenuClick(this._nameAddMenuItem);
  }

  addMenuClickHandler(callback, element, nameAddMenuItem) {
    this._callback.addMenuClick = callback;
    this._nameAddMenuItem = nameAddMenuItem;
    element.addEventListener(`click`, this._addMenuClickHandler);
  }

  setMenuItem(menuItem) {
    const itemList = this.getElement().querySelectorAll(`a.trip-tabs__btn`);
    itemList.forEach((it) => it.classList.remove(this._active));

    const item = this.getElement().querySelector(`a[name=${menuItem}]`);

    if (item !== null) {
      item.classList.add(this._active);
    }
  }
}
