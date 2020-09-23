import {MONTHS} from '../const';

// добавляет ведущие нули: ( '2' => '02')
export const addZeros = (number, digitsInNumber = 2) => {
  let n = String(number);
  while (n.length < digitsInNumber) {
    n = `0` + n;
  }
  return n;
};

// форматривание дат: dm:'AUG 25' md:'25 AUG' hm:'10:30' ymd:'2020-08-25'
//                    ymdhm:'2019-03-18T10:30' dmy:18/03/19 00:00
export const formatDate = {
  dm: (date) => `${date.getDate()} ${MONTHS[date.getMonth()]}`,
  md: (date) => `${MONTHS[date.getMonth()]} ${date.getDate()}`,
  hm: (date) => `${addZeros(date.getHours())}:${addZeros(date.getMinutes())}`,
  ymd: (date) => `${date.getFullYear()}-${addZeros(date.getMonth() + 1)}-${addZeros(date.getDate())}`,
  dmy: (date) => `${date.getDate()}/${addZeros(date.getMonth() + 1)}/${String(date.getFullYear()).slice(2)} ${formatDate.hm(date)}`,
  ymdhm: (date) => `${formatDate.ymd(date)}T${formatDate.hm(date)}`,
};

// замена в строке (по умолчанию меняет два тире на длинное тире в html)
export const replaceStr = (str, search = `--`, replace = `&nbsp;&mdash;&nbsp;`) => str.split(search).join(replace);

// возвращает значения из массива объектов по ключу
export const getValuesByKey = ({key, arrayObj} = {}) => {
  return arrayObj.reduce((array, it) => {
    array.push(it[key]);
    return array;
  }, []);
};

// хранилище уникальных пар: key->value, !при повторном добавлении key удаляется из хранилища
export default class StoreItems {
  constructor(keyName = `key`, valueName = `value`) {
    this._store = {};
    this._keyName = keyName;
    this._valueName = valueName;
  }

  add(key, value) {
    if (this._store[key]) {
      delete this._store[key];
    } else {
      this._store[key] = value;
    }

    return this;
  }

  init(items) {
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const values = Object.values(item);
        this.add(values[0], values[1]);
      });
    }

    return this;
  }

  destroy() {
    this._store = {};
    return this;
  }

  getItems() {
    return Object
      .entries(this._store)
      .map(([key, value]) => ({[this._keyName]: key, [this._valueName]: value}));
  }
}

export const bindHandlers = (handlerMap, that) => {
  Object.keys(handlerMap).forEach((handler) =>
    (handlerMap[handler] = handlerMap[handler].bind(that))
  );
};

export const getNumber = (value) => isNaN(Number(value)) ? 0 : Number(value);
