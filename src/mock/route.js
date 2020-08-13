import {Param} from './param';
import {getRandomInteger, getRandomSentences, getRandomPhotos, getNextRandomDate} from "../utils";

const generatePointType = () => {
  const {EVENT: event} = Param;

  const events = [...event.PLACE.NAMES, ...event.VEHICLE.NAMES];

  const index = getRandomInteger(0, events.length - 1);

  return events[index];
};

const generateDestination = (destinations) => {
  const index = getRandomInteger(0, destinations.length - 1);

  return destinations[index];
};

const getRandomOffers = () => {
  const {length} = Param.OFFERS_NAME;

  return Array(length).fill().map(() => {
    const index = getRandomInteger(0, Param.OFFERS_NAME.length - 1);
    return {
      type: generatePointType(),
      name: Param.OFFERS_NAME[index],
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

let currentDate = Date.now();

export const generateRoute = () => {
  const type = generatePointType();
  const times = [`hours`, `minutes`, `hoursminutes`];
  const startDate = getNextRandomDate(currentDate, `hours`);
  const index = getRandomInteger(0, times.length - 1);
  const endDate = getNextRandomDate(startDate, times[index]);

  currentDate = endDate;

  return {
    type,
    date1: startDate,
    date2: endDate,
    destination: generateDestination(Param.DESTINATIONS),
    info: {
      description: getRandomSentences(Param.TEXT),
      photos: getRandomPhotos(Param.URL_PHOTO),
    },
    price: getRandomInteger(50, 400),
    offers: generateOffers(type),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
