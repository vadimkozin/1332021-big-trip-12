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

const getRandomDestinations = () => {
  const {length} = Mock.DESTINATIONS;
  let index = 0;

  return Array(length).fill().map(() =>
    ({
      name: Mock.DESTINATIONS[index++],
      photos: getRandomPhotos(Mock.URL_PHOTO),
      description: getRandomSentences(Mock.TEXT),
    })
  );
};

const destinations = getRandomDestinations();

export const getDestinationByName = (name) => destinations.find((dest) => dest.name === name);

const getRandomOffers = () => {
  const {length} = Mock.OFFERS_NAME;
  let index = 0;

  return Array(length).fill().map(() =>
    ({
      type: generatePointType(),
      name: Mock.OFFERS_NAME[index++],
      price: getRandomInteger(10, 100),
    })
  );
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
  const destination = generateDestination(Mock.DESTINATIONS);

  currentDate = endDate;

  return {
    id: generateId(),
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
  // return {
  //   id: generateId(),
  //   type,
  //   startDate,
  //   endDate,
  //   destination: generateDestination(Mock.DESTINATIONS),
  //   info: {
  //     description: getRandomSentences(Mock.TEXT),
  //     photos: getRandomPhotos(Mock.URL_PHOTO),
  //   },
  //   price: getRandomInteger(50, 400),
  //   offers: generateOffers(type),
  //   isFavorite: Boolean(getRandomInteger(0, 1)),
  // };

};
