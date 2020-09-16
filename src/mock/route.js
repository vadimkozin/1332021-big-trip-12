import uniqueId from 'lodash.uniqueid';
import {Mock} from '../const';
import {getRandomInteger, getRandomSentences, getRandomPictures, getNextRandomDate} from "../utils/common";

export const DESTINATION_BLANK = {
  name: Mock.DESTINATIONS[0],
  pictures: [{src: `#`, description: ``}],
  description: ``,
};

export const POINT_BLANK = {
  type: Mock.EVENT.VEHICLE.NAMES[0],
  startDate: new Date(),
  endDate: new Date(),
  destination: DESTINATION_BLANK,
  price: 0,
  offers: [],
  isFavorite: false,
};

const generatePointType = () => {
  const {EVENT: event} = Mock;

  const events = [...event.PLACE.NAMES, ...event.VEHICLE.NAMES];

  const index = getRandomInteger(0, events.length - 1);

  return events[index];
};

const destinations = Mock.DESTINATIONS.map((destination) =>
  ({
    name: destination,
    pictures: getRandomPictures(Mock.URL_PHOTO, destination),
    description: getRandomSentences(Mock.TEXT),
  })
);

const getRandomDestination = () => {
  const index = getRandomInteger(0, destinations.length - 1);
  return destinations[index];
};

export const getDestinationByName = (name) => destinations.find((dest) => dest.name === name);

export const offers = Mock.OFFERS_NAME.map((title) =>
  ({
    title,
    type: generatePointType(),
    price: getRandomInteger(10, 100),
  })
);

const generateOffers = (type, from = 0, to = 5) => {
  const array = offers
    .filter((offer) => offer.type === type)
    .map((offer) => ({title: offer.title, price: offer.price}));

  const count = getRandomInteger(from, Math.min(to, array.length - 1));

  return array.slice(0, count);
};

export const getOffersByType = (type) => offers.filter((offer) => offer.type === type);

let currentDate = Date.now();

export const generateRoute = () => {
  const type = generatePointType();
  const times = [`hours`, `minutes`, `hoursminutes`];
  const startDate = getNextRandomDate(currentDate, `hours`);
  const index = getRandomInteger(0, times.length - 1);
  const endDate = getNextRandomDate(startDate, times[index]);
  const destination = getRandomDestination();

  currentDate = endDate;

  return {
    id: uniqueId(),
    type,
    startDate,
    endDate,
    destination,
    price: getRandomInteger(50, 400),
    offers: generateOffers(type),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
