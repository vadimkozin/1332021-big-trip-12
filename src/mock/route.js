import uniqueId from 'lodash.uniqueid';
import {Mock} from '../const';
import {getRandomInteger, getRandomSentences, getRandomPhotos, getNextRandomDate} from "../utils/common";

const generatePointType = () => {
  const {EVENT: event} = Mock;

  const events = [...event.PLACE.NAMES, ...event.VEHICLE.NAMES];

  const index = getRandomInteger(0, events.length - 1);

  return events[index];
};

const generateDestination = (destinations) => {
  const index = getRandomInteger(0, destinations.length - 1);

  return destinations[index];
};

const destinations = Mock.DESTINATIONS.map((destination) =>
  ({
    name: destination,
    photos: getRandomPhotos(Mock.URL_PHOTO),
    description: getRandomSentences(Mock.TEXT),
  })
);

export const getDestinationByName = (name) => destinations.find((dest) => dest.name === name);

export const offers = Mock.OFFERS_NAME.map((name) =>
  ({
    name,
    type: generatePointType(),
    price: getRandomInteger(10, 100),
  })
);

const generateOffers = (type, from = 0, to = 5) => {
  const array = offers
    .filter((it) => it.type === type)
    .map((it) => ({name: it.name, price: it.price}));

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
  const destination = generateDestination(Mock.DESTINATIONS);

  currentDate = endDate;

  return {
    id: uniqueId(),
    type,
    startDate,
    endDate,
    destination,
    description: getDestinationByName(destination).description,
    photos: getDestinationByName(destination).photos,
    price: getRandomInteger(50, 400),
    offers: generateOffers(type),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
