import {Mock} from '../const';
import {getRandomInteger, getRandomSentences, getRandomPhotos, getNextRandomDate} from "../utils/common";

let countId = 1;

const generateId = () => countId++;

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

const getRandomOffers = () => {
  const {length} = Mock.OFFERS_NAME;

  return Array(length).fill().map(() => {
    const index = getRandomInteger(0, Mock.OFFERS_NAME.length - 1);
    return {
      type: generatePointType(),
      name: Mock.OFFERS_NAME[index],
      price: getRandomInteger(10, 100),
    };
  });
};

const offers = getRandomOffers();

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

  currentDate = endDate;

  return {
    id: generateId(),
    type,
    startDate,
    endDate,
    destination: generateDestination(Mock.DESTINATIONS),
    info: {
      description: getRandomSentences(Mock.TEXT),
      photos: getRandomPhotos(Mock.URL_PHOTO),
    },
    price: getRandomInteger(50, 400),
    offers: generateOffers(type),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
