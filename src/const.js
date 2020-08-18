export const MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export const Mock = {
  TEXT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
  OFFERS_NAME: [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add brekfast`, `Add Meal`, `Child seat`, `Set of underwear`, `Best place`, `Good view`, `Good neighbor`, `offer-01`, `offer-02`, `offer-03`, `offer-04`, `offer-05`],
  DESTINATIONS: [`Amsterdam`, `Chamonix`, `Geneva`, `Saint-Petersburg`, `Novgorod`, `Pskov`],
  EVENT: {
    PLACE: {
      NAMES: [`Check-in`, `Sightseeing`, `Restaurant`],
      ACTION: `in`,
    },
    VEHICLE: {
      NAMES: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
      ACTION: `to`,
    },
  },
  URL_PHOTO: `http://picsum.photos/248/152?r=`,
};

export const Time = {
  ADD_MINUTES: `minutes`,
  ADD_HOURS: `hours`,
  ADD_DAYS: `days`,
  ADD_HOURS_AND_MINUTES: `hoursminutes`,
};

export const Duration = {
  MSEC_PER_MINUTE: 60 * 1000, // миллисекунд в минуте
  MSEC_PER_HOUR: 60 * 60 * 1000, // миллисекунд в часе
  MSEC_PER_DAY: 60 * 60 * 1000 * 24, // миллисекунд в сутках
};

export const OFFERS_MAX = 3; // показывать максимально предложений в отчёте

export const ESCAPE_CODE = 27;

// ===
export const Config = {
  MONTHS: [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
  TIME: {
    ADD_MINUTES: `minutes`,
    ADD_HOURS: `hours`,
    ADD_DAYS: `days`,
    ADD_HOURS_AND_MINUTES: `hoursminutes`,
  },
  DURATION: {
    MSEC_PER_MINUTE: 60 * 1000, // миллисекунд в минуте
    MSEC_PER_HOUR: 60 * 60 * 1000, // миллисекунд в часе
    MSEC_PER_DAY: 60 * 60 * 1000 * 24, // миллисекунд в сутках
  },
  OFFERS_MAX: 3, // показывать максимально предложений в отчёте
  POSITION: {
    BEFORE_BEGIN: `beforebegin`,
    AFTER_BEGIN: `afterbegin`,
    BEFORE_END: `beforeend`,
    AFTER_END: `afterend`,
  },
  MOCK: { // моковые данные
    TEXT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,
    OFFERS_NAME: [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add brekfast`, `Add Meal`, `Child seat`, `Set of underwear`, `Best place`, `Good view`, `Good neighbor`, `offer-01`, `offer-02`, `offer-03`, `offer-04`, `offer-05`],
    DESTINATIONS: [`Amsterdam`, `Chamonix`, `Geneva`, `Saint-Petersburg`, `Novgorod`, `Pskov`],
    EVENT: {
      PLACE: {
        NAMES: [`Check-in`, `Sightseeing`, `Restaurant`],
        ACTION: `in`,
      },
      VEHICLE: {
        NAMES: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
        ACTION: `to`,
      },
    },
    URL_PHOTO: `http://picsum.photos/248/152?r=`,
  },
  ESCAPE_CODE: 27,
};
