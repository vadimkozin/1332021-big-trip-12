import {MONTHS, Mock, Duration, SEPARATOR, INFO_ROUTE_CITIES_MAX} from '../const';
import {addZeros, formatDate, getValuesByKey} from './common';

const ROUTE_INFO_BLANK = {
  nameRoute: ``,
  begin: null,
  end: null,
  duration: ``,
  total: 0
};

// возвращает уникальные дни маршрута: [1,2,..]
export const getDaysRoute = (points) =>
  [...new Set(getValuesByKey({key: `order`, arrayObj: points}))];

// возвращает продолжительность маршрута в формате: "23M" or "02H 44M" or "01D 02H 30M"
const getDurationRoute = (milliseconds) => {
  const hoursInRoute = milliseconds / Duration.MSEC_PER_HOUR;
  const daysInRoute = milliseconds / Duration.MSEC_PER_DAY;

  if (hoursInRoute < 1) { // "23M"
    return `${addZeros(Math.floor(milliseconds / Duration.MSEC_PER_MINUTE))}M`;

  } else if (daysInRoute < 1) { // "02H 44M"
    const hours = Math.floor(milliseconds / Duration.MSEC_PER_HOUR);
    const msec = milliseconds - hours * Duration.MSEC_PER_HOUR;
    const minutes = msec / Duration.MSEC_PER_MINUTE;
    return `${addZeros(Math.floor(hours))}H ${addZeros(Math.floor(minutes))}M`;

  } else { // "01D 02H 30M"
    const days = Math.floor(milliseconds / Duration.MSEC_PER_DAY);
    let msec = milliseconds - days * Duration.MSEC_PER_DAY;
    const hours = Math.floor(msec / Duration.MSEC_PER_HOUR);
    msec -= hours * Duration.MSEC_PER_HOUR;
    const minutes = msec / Duration.MSEC_PER_MINUTE;
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

// возвращает разницу dateEnd-dateStart в виде объекта {time, duration}
// например:  {time: '10:30-11:00', duration: '30М'}
export const getTimeAndDuration = (dateStart = new Date(), dateEnd = new Date()) => (
  {
    duration: getDurationRoute(dateEnd - dateStart),
    time: getTimeRoute(dateStart, dateEnd),
  }
);

// возвращает продолжительность маршрута в виде: "18 AUG--6 OCT" или "MAR 18--20"
const getDuration = (startDate, endDate, separator = SEPARATOR) => {
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

// возвращает инфо по маршруту
export const getRouteInfo = (routePoints) => {
  if (!routePoints.length) {
    return ROUTE_INFO_BLANK;
  }

  const points = routePoints.slice().sort((a, b) => a.startDate > b.startDate);
  const begin = formatDate.dm(points[0].startDate).toUpperCase();
  const end = formatDate.dm(points[points.length - 1].endDate).toUpperCase();
  const duration = getDuration(points[0].startDate, points[points.length - 1].endDate).toUpperCase();

  // список городов(пунктов назначения) в хронологическом порядке
  const cities = getValuesByKey({key: `destination`, arrayObj: points});

  const total = points.reduce((sum, it) =>
    sum + it.price + it.offers.reduce((sumOffer, offer) => sumOffer + offer.price, 0)
  , 0);

  return {
    nameRoute: cities.length <= INFO_ROUTE_CITIES_MAX
      ? cities.join(SEPARATOR)
      : `${cities[0]}${SEPARATOR}...${SEPARATOR}${cities[cities.length - 1]}`,
    begin,
    end,
    duration,
    total
  };
};

export const sortPrice = (a, b) => b.price - a.price;
export const sortTime = (a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate);
export const sortDays = (a, b) => a.startDate - b.startDate;

// фильтры: всё, запланированно, пройдено
// Это не перечисления, это то, что автор называет: объектами-неймспейсами (критерий Б16)
// https://up.htmlacademy.ru/ecmascript/12/criteries#b16
export const filterRoute = {
  everything: (points) => points,
  future: (points) => points.filter((it) => it.startDate.getTime() > Date.now()),
  past: (points) => points.filter((it) => it.endDate.getTime() < Date.now()),
};

// установка порядкового номера дня для каждой точки маршрута (мутация)
export const setOrdinalDaysRoute = (points) => {
  points.sort((a, b) => a.startDate - b.startDate);

  let currentDay = formatDate.ymd(points[0].startDate);

  points.reduce((order, it) => {
    const day = formatDate.ymd(it.startDate);

    if (day === currentDay) {
      it.order = order;
    } else {
      it.order = ++order;
      currentDay = day;
    }
    return order;

  }, 1);
};

const getMap = (event) =>
  event.NAMES.reduce((acc, name) => Object.assign(acc, {[name]: event.ACTION}), {});

const namesToActionMap = Object.assign({}, getMap(Mock.EVENT.PLACE), getMap(Mock.EVENT.VEHICLE));

// возвращает название события в виде: 'Taxi to Amsterdam' || 'Restaurant in Geneva'
export const getEventTitle = (type, destination) => getEventInfo(type, destination);

// возвращает название события в виде: 'Taxi to' || 'Restaurant in'
export const getEventType = (type) => getEventInfo(type);

const getEventInfo = (type, destination) => {
  const action = namesToActionMap[type];
  return destination
    ? `${type} ${action} ${destination}`
    : `${type} ${action}`;
};

