export const MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export const Offer = {
  TRANSFERS: [`taxi`, `bus`, `train`, `flight`, `ship`, `transport`, `drive`],
  ACTIVITIES: [`check-in`, `sightseeing`, `restaurant`],
  ACTION: {
    TRANSFER: `to`,
    ACTIVITY: `in`,
  }
};

export const Duration = {
  MSEC_PER_MINUTE: 60 * 1000,
  MSEC_PER_HOUR: 60 * 60 * 1000,
  MSEC_PER_DAY: 60 * 60 * 1000 * 24,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
};

export const OFFERS_MAX = 3;
export const ESCAPE_CODE = 27;
export const SEPARATOR = `--`;
export const INFO_ROUTE_CITIES_MAX = 3;

export const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuItem = {
  ADD_NEW_EVENT: `ADD_NEW_EVENT`,
  TABLE: `Table`,
  STATS: `Stats`,
};

export const Flags = {
  isDisabled: false,
  isSaving: false,
  isDeleting: false,
};
