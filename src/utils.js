import {Config} from './const';

const {MONTHS, MOCK, POSITION} = Config;

export const render = (container, element, place = POSITION.BEFORE_END) => {
  switch (place) {
    case POSITION.BEFORE_BEGIN:
      container.before(element);
      break;
    case POSITION.AFTER_BEGIN:
      container.prepend(element);
      break;
    case POSITION.BEFORE_END:
      container.append(element);
      break;
    case POSITION.AFTER_END: //
      container.after(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// возвращает случайное число из диапазона между min и max (оба включены)
export const getRandomInteger = (min = 0, max = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// добавляет ведущие нули: ( '2' => '02')
const addZeros = (number, digitsInNumber = 2) => {
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

// возвращает продолжительность маршрута в формате: "23M" or "02H 44M" or "01D 02H 30M"
const getDurationRoute = (milliseconds) => {
  const duration = Config.DURATION;
  const hoursInRoute = milliseconds / duration.MSEC_PER_HOUR;
  const daysInRoute = milliseconds / duration.MSEC_PER_DAY;

  if (hoursInRoute < 1) { // "23M"
    return `${addZeros(Math.floor(milliseconds / duration.MSEC_PER_MINUTE))}M`;

  } else if (daysInRoute < 1) { // "02H 44M"
    const hours = Math.floor(milliseconds / duration.MSEC_PER_HOUR);
    const msec = milliseconds - hours * duration.MSEC_PER_HOUR;
    const minutes = msec / duration.MSEC_PER_MINUTE;
    return `${addZeros(Math.floor(hours))}H ${addZeros(Math.floor(minutes))}M`;

  } else { // "01D 02H 30M"
    const days = Math.floor(milliseconds / duration.MSEC_PER_DAY);
    let msec = milliseconds - days * duration.MSEC_PER_DAY;
    const hours = Math.floor(msec / duration.MSEC_PER_HOUR);
    msec -= hours * duration.MSEC_PER_HOUR;
    const minutes = msec / duration.MSEC_PER_MINUTE;
    return `${addZeros(Math.floor(days))}D ${addZeros(Math.floor(hours))}H ${addZeros(Math.floor(minutes))}M`;
  }
};

// возвращает время маршрута в формате: начало-окончание: '10:30 - 11:00'
const getTimeRoute = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const from = `${addZeros(start.getHours())}:${addZeros(start.getMinutes())}`;
  const to = `${addZeros(end.getHours())}:${addZeros(end.getMinutes())}`;

  return `${from} - ${to}`;
};

// возвращает разницу date2-date1 в виде объекта {time, duration}
// например:  {time: '10:30-11:00', duration: '30М'}
export const getTimeAndDuration = (date1 = new Date(), date2 = new Date()) => (
  {
    duration: getDurationRoute(date2 - date1),
    time: getTimeRoute(date1, date2),
  }
);

// возвращает случайную дату позднее чем lastDate,
// добавляя timeShift, одно из: ['minutes', 'hours', 'days', 'hoursminutes']
export const getNextRandomDate = (lastDate = Date.now(), timeShift = `hours`) => {
  const minutes = getRandomInteger(10, 59);
  const hours = getRandomInteger(1, 10);
  const days = getRandomInteger(1, 3);
  const {TIME: time, DURATION: dur} = Config;

  switch (timeShift) {
    case time.ADD_MINUTES:
      return new Date(lastDate.valueOf() + minutes * dur.MSEC_PER_MINUTE);
    case time.ADD_HOURS:
      return new Date(lastDate.valueOf() + hours * dur.MSEC_PER_HOUR);
    case time.ADD_DAYS:
      return new Date(lastDate.valueOf() + days * dur.MSEC_PER_DAY);
    case time.ADD_HOURS_AND_MINUTES:
      return new Date(lastDate.valueOf() + hours * dur.MSEC_PER_HOUR + minutes * dur.MSEC_PER_MINUTE);
    default:
      return new Date(lastDate.valueOf() + hours * dur.MSEC_PER_HOUR);
  }
};

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

// возвращает продолжительность маршрута в виде: "18 AUG--6 OCT" или "MAR 18--20"
const getDuration = (startDate, endDate, separator = `--`) => {
  const isOneMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
  const isOneDay = isOneMonth && startDate.getDate() === endDate.getDate();

  if (isOneDay) { // 18 AUG
    return `${formatDate.dm(startDate)}`;
  } else if (isOneMonth) { // AUG 18--20
    return `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}${separator}${endDate.getDate()}`;
  } else { // 18 AUG--6 OCT
    return `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}${separator}${endDate.getDate()} ${MONTHS[endDate.getMonth()]}`;
  }

};

// замена в строке (по умолчанию меняет два тире на длинное тире в html)
export const replaceStr = (str, search = `--`, replace = `&nbsp;&mdash;&nbsp;`) => str.split(search).join(replace);

export const getDaysRoute = (points) => {
  const days = points.reduce((orders, it) => {
    orders.push(it.order);
    return orders;
  }, []);

  return [...new Set(days)];
};

// возвращает инфо по маршруту
export const getRouteInfo = (route) => {
  const separator = `--`;
  const points = route.slice().sort((a, b) => a.startDate > b.startDate);
  const begin = formatDate.dm(points[0].startDate).toUpperCase();
  const end = formatDate.dm(points[points.length - 1].endDate).toUpperCase();
  const duration = getDuration(points[0].startDate, points[points.length - 1].endDate).toUpperCase();

  // список городов(пунктов назначения) в хронологическом порядке
  const cities = points.reduce((acc, it) => {
    acc.push(`${it.destination}`);
    return acc;
  }, []);

  let nameRoute = ``;

  nameRoute = cities.length <= 3
    ? cities.join(separator)
    : `${cities[0]}${separator}...${separator}${cities[cities.length - 1]}`;

  const total = points.reduce((sum, it) =>
    sum + it.price + it.offers.reduce((sumOffer, offer) => sumOffer + offer.price, 0)
  , 0);

  return {
    nameRoute,
    begin,
    end,
    duration,
    total
  };
};

// сортировка по: дням, цене и продолжительности
// Это не перечисления, это то, что автор называет: объектами-неймспейсами (критерий Б16)
// https://up.htmlacademy.ru/ecmascript/12/criteries#b16
export const sortRoute = {
  days: (points) => points.sort((a, b) => a.startDate - b.startDate),
  price: (points) => points.sort((a, b) => b.price - a.price),
  time: (points) => points.sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate)),
};

// фильтры: всё, запланированно, пройдено
// Это не перечисления, это то, что автор называет: объектами-неймспейсами (критерий Б16)
// https://up.htmlacademy.ru/ecmascript/12/criteries#b16
export const filterRoute = {
  everything: (points) => points,
  future: (points) => points.filter((it) => it.startDate.getTime() > Date.now()),
  past: (points) => points.filter((it) => it.endDate.getTime() < Date.now()),
};

// установка порядкового номера дня для каждой точки маршрута
export const setOrdinalDaysRoute = (points) => {
  let order = 1;

  points.sort((a, b) => a.startDate - b.startDate);

  let currentDay = formatDate.ymd(points[0].startDate);

  return points.map((it) => {

    const day = formatDate.ymd(it.startDate);

    if (day === currentDay) {
      it.order = order;
    } else {
      it.order = ++order;
      currentDay = day;
    }

    return it;
  });
};

const getMap = (event) =>
  event.NAMES.reduce((acc, name) => Object.assign(acc, {[name]: event.ACTION}), {});

const namesToActionMap = Object.assign({}, getMap(MOCK.EVENT.PLACE), getMap(MOCK.EVENT.VEHICLE));

// возвращает название события в виде: 'Taxi to Amsterdam' || 'Restaurant in Geneva'
export const getEventTitle = (type, destination) => {
  const action = namesToActionMap[type];
  return `${type} ${action} ${destination}`;
};

// возвращает название события в виде: 'Taxi to' || 'Restaurant in'
export const getEventType = (type) => {
  const action = namesToActionMap[type];
  return `${type} ${action}`;
};
