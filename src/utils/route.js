import moment from 'moment';
import {MONTHS, Duration, SEPARATOR, INFO_ROUTE_CITIES_MAX, Offer} from '../const';
import {addZeros, formatDate, getValuesByKey} from './common';

export const DESTINATION_BLANK = {
  name: ``,
  pictures: [{src: `#`, description: ``}],
  description: ``,
};

export const POINT_BLANK = {
  type: Offer.TRANSFERS[1],
  startDate: new Date(),
  endDate: new Date(),
  destination: DESTINATION_BLANK,
  price: 0,
  offers: [],
  isFavorite: false,
};

const ROUTE_INFO_BLANK = {
  nameRoute: ``,
  begin: null,
  end: null,
  duration: ``,
  total: 0
};

export const getDaysRoute = (points) =>
  [...new Set(getValuesByKey({key: `order`, arrayObj: points}))];

export const getDurationRoute = (milliseconds) => {
  const duration = moment.duration(milliseconds);

  const days = addZeros(Math.floor(duration.asDays()));
  const hours = addZeros(duration.hours());
  const minutes = addZeros(duration.minutes());

  if (duration.asMinutes() < Duration.MINUTES_PER_HOUR) {
    return `${minutes}M`;
  } else if (duration.asHours() < Duration.HOURS_PER_DAY) {
    return `${hours}H ${minutes}M`;
  }

  return `${days}D ${hours}H ${minutes}M`;
};

const getTimeRoute = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const from = `${addZeros(start.getHours())}:${addZeros(start.getMinutes())}`;
  const to = `${addZeros(end.getHours())}:${addZeros(end.getMinutes())}`;

  return `${from} - ${to}`;
};

export const getTimeAndDuration = (dateStart = new Date(), dateEnd = new Date()) => (
  {
    duration: getDurationRoute(dateEnd - dateStart),
    time: getTimeRoute(dateStart, dateEnd),
  }
);

const getDuration = (startDate, endDate, separator = SEPARATOR) => {
  const isOneMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
  const isOneDay = isOneMonth && startDate.getDate() === endDate.getDate();

  if (isOneDay) {
    return `${formatDate.dm(startDate)}`;
  } else if (isOneMonth) {
    return `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}${separator}${endDate.getDate()}`;
  } else {
    return `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}${separator}${endDate.getDate()} ${MONTHS[endDate.getMonth()]}`;
  }

};

export const getRouteInfo = (routePoints) => {
  if (!routePoints.length) {
    return ROUTE_INFO_BLANK;
  }

  const points = routePoints.slice().sort((a, b) => a.startDate - b.startDate);
  const begin = formatDate.dm(points[0].startDate).toUpperCase();
  const end = formatDate.dm(points[points.length - 1].endDate).toUpperCase();
  const duration = getDuration(points[0].startDate, points[points.length - 1].endDate).toUpperCase();
  const cities = points.map((point) => point.destination.name);

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

const getMap = (array, value) =>
  array.reduce((acc, name) => Object.assign(acc, {[name]: value}), {});

const namesToActionMap = Object.assign({},
    getMap(Offer.TRANSFERS, Offer.ACTION.TRANSFER),
    getMap(Offer.ACTIVITIES, Offer.ACTION.ACTIVITY));

export const getEventTitle = (type, destination) => getEventInfo(type, destination);

export const getEventType = (type) => getEventInfo(type);

const getEventInfo = (type, destination) => {
  const action = namesToActionMap[type.toLowerCase()];
  return destination
    ? `${type} ${action} ${destination}`
    : `${type} ${action}`;
};
