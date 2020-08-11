const Param = {
  TEXT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
  OFFERS_NAME: [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add brekfast`, `Child seat`, `Set of underwear`, `Best place`, `Good view`, `Good neighbor`, `offer-01`, `offer-02`, `offer-03`, `offer-04`, `offer-05`],
  DESTINATIONS: [`Amsterdam`, `Chamonix`, `Geneva`, `Saint-Petersburg`, `Novgorod`, `Pskov`],
  Event: {
    Place: {
      NAMES: [`Check-in`, `Sightseeing`, `Restaurant`],
      ACTION: `in`,
    },
    Vehicle: {
      NAMES: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
      ACTION: `to`,
    },
  },
  URL_PHOTO: `http://picsum.photos/248/152?r=`,
};

const getObjMap = (event) => {

  const {NAMES: names, ACTION: action} = event;
  const obj = Object.create(null);

  names.forEach((it) => {
    obj[it] = action;
  });

  return obj;
};

const namesToActionMap = (() => {

  const o1 = getObjMap(Param.Event.Place);
  const o2 = getObjMap(Param.Event.Vehicle);
  const o = Object.assign({}, o1, o2);

  return o;

})();

export {
  Param,
  namesToActionMap,
};
