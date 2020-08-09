import {getRandomInteger, getRandomSentences, getRandomPhotos, getNextRandomDate} from "../utils";

const Param = {
  TEXT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
  OFFERS_NAME: [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add brekfast`, `Child seat`, `Set of underwear`, `Friend of the director`, `offer-01`, `offer-02`, `offer-03`, `offer-04`, `offer-05`],
  DESTINATIONS: [`Amsterdam`, `Chamonix`, `Geneva`, `Saint-Petersburg`, `Novgorod`, `Pskov`],
  Point: {
    Place: {
      NAMES: [`Check`, `Sightseeing`, `Restaurant`],
      ACTION: `in`,
    },
    Vehicle: {
      NAMES: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
      ACTION: `to`,
    },
  },
  URL_PHOTO: `http://picsum.photos/248/152?r=`,
};

const generatePointType = () => {

  const {Point: point} = Param;

  const points = [...point.Place.NAMES, ...point.Vehicle.NAMES];

  const index = getRandomInteger(0, points.length - 1);

  return points[index];
};

const generateDestination = (destinations) => {

  const index = getRandomInteger(0, destinations.length - 1);

  return destinations[index];
};

const offers = (() => {
  const count = Param.OFFERS_NAME.length;

  return Array(count).fill().map(() => {
    const index = getRandomInteger(0, Param.OFFERS_NAME.length - 1);
    return {
      type: generatePointType(),
      name: Param.OFFERS_NAME[index],
      price: getRandomInteger(10, 100),
    };
  });
})();

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
  const date1 = getNextRandomDate(currentDate, `hours`);
  const date2 = getNextRandomDate(date1, `minutes`);

  currentDate = date2;

  return {
    type,
    date1,
    date2,
    adur: date2 - date1,
    destination: generateDestination(Param.DESTINATIONS),
    info: {
      description: getRandomSentences(Param.TEXT),
      photos: getRandomPhotos(Param.URL_PHOTO),
    },
    price: getRandomInteger(50, 1000),
    offers: generateOffers(type),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
