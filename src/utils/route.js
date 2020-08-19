import {MONTHS, Mock, Duration} from '../const';
import {addZeros, formatDate} from './common';

const ROUTE_INFO_BLANK = {
  nameRoute: ``,
  begin: null,
  end: null,
  duration: ``,
  total: 0
};

export const getDaysRoute = (points) => {
  const days = points.reduce((orders, it) => {
    orders.push(it.order);
    return orders;
  }, []);

  return [...new Set(days)];
};

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

// возвращает разницу date2-date1 в виде объекта {time, duration}
// например:  {time: '10:30-11:00', duration: '30М'}
export const getTimeAndDuration = (date1 = new Date(), date2 = new Date()) => (
  {
    duration: getDurationRoute(date2 - date1),
    time: getTimeRoute(date1, date2),
  }
);

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

// возвращает инфо по маршруту
export const getRouteInfo = (routePoints) => {
  if (!routePoints.length) {
    return ROUTE_INFO_BLANK;
  }

  const separator = `--`;
  const points = routePoints.slice().sort((a, b) => a.startDate > b.startDate);
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

const namesToActionMap = Object.assign({}, getMap(Mock.EVENT.PLACE), getMap(Mock.EVENT.VEHICLE));

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
