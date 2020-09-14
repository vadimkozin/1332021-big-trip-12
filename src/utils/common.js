import {MONTHS, Time, Duration} from '../const';

// возвращает случайное число из диапазона между min и max (оба включены)
export const getRandomInteger = (min = 0, max = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// добавляет ведущие нули: ( '2' => '02')
export const addZeros = (number, digitsInNumber = 2) => {
  let n = String(number);
  while (n.length < digitsInNumber) {
    n = `0` + n;
  }
  return n;
};

// форматривание дат: dm:'AUG 25' md:'25 AUG' hm:'10:30' ymd:'2020-08-25'
// ymdhm:'2019-03-18T10:30' dmy:18/03/19 00:00
export const formatDate = {
  dm: (date) => `${date.getDate()} ${MONTHS[date.getMonth()]}`,
  md: (date) => `${MONTHS[date.getMonth()]} ${date.getDate()}`,
  hm: (date) => `${addZeros(date.getHours())}:${addZeros(date.getMinutes())}`,
  ymd: (date) => `${date.getFullYear()}-${addZeros(date.getMonth() + 1)}-${addZeros(date.getDate())}`,
  dmy: (date) => `${date.getDate()}/${addZeros(date.getMonth() + 1)}/${String(date.getFullYear()).slice(2)} ${formatDate.hm(date)}`,
  ymdhm: (date) => `${formatDate.ymd(date)}T${formatDate.hm(date)}`,
};

// возвращает дату (Date) из строки в формате: 25/09/20 14:23
export const getDateFrom = (value) => {
  const isNormalFormatDate = /^\d{1,2}\/\d{1,2}\/\d{2}\s+\d{2}:\d{2}$/.test(value);

  if (!isNormalFormatDate) {
    return null;
  }

  const [dayMonthYear, time] = value.split(/\s+/);
  const [day, month, year] = dayMonthYear.split(`/`);

  return new Date(Date.parse(`${month}/${day}/${year} ${time}`));
};

// замена в строке (по умолчанию меняет два тире на длинное тире в html)
export const replaceStr = (str, search = `--`, replace = `&nbsp;&mdash;&nbsp;`) => str.split(search).join(replace);

// возвращает случайные предложения из текста
export const getRandomSentences = (text, separator = `.`, from = 1, to = 5) => {
  const countSentences = getRandomInteger(from, to);
  const sentences = text.split(separator);
  const result = [];

  for (let i = 0; i < countSentences; i++) {
    const index = getRandomInteger(0, sentences.length - 1);
    result.push(sentences[index]);
  }

  return result.join(separator).trim();

};

// возвращает массив случайных фото
export const getRandomPhotos = (url, from = 1, to = 5) => {
  const count = getRandomInteger(from, to);

  return Array(count).fill().map(() => `${url}${Math.random()}`);
};

// возвращает случайную дату позднее чем lastDate,
// добавляя timeShift, одно из: ['minutes', 'hours', 'days', 'hoursminutes']
export const getNextRandomDate = (lastDate = Date.now(), timeShift = `hours`) => {
  const minutes = getRandomInteger(10, 59);
  const hours = getRandomInteger(1, 10);
  const days = getRandomInteger(1, 3);

  switch (timeShift) {
    case Time.ADD_MINUTES:
      return new Date(lastDate.valueOf() + minutes * Duration.MSEC_PER_MINUTE);
    case Time.ADD_HOURS:
      return new Date(lastDate.valueOf() + hours * Duration.MSEC_PER_HOUR);
    case Time.ADD_DAYS:
      return new Date(lastDate.valueOf() + days * Duration.MSEC_PER_DAY);
    case Time.ADD_HOURS_AND_MINUTES:
      return new Date(lastDate.valueOf() + hours * Duration.MSEC_PER_HOUR + minutes * Duration.MSEC_PER_MINUTE);
    default:
      return new Date(lastDate.valueOf() + hours * Duration.MSEC_PER_HOUR);
  }
};

// возвращает значения из массива объектов по ключуы
export const getValuesByKey = ({key, arrayObj} = {}) => {
  return arrayObj.reduce((array, it) => {
    array.push(it[key]);
    return array;
  }, []);
};

// обновляет элемент в списке
export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
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
