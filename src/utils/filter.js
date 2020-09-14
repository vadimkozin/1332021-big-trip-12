import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((it) => it.startDate.getTime() > Date.now()),
  [FilterType.PAST]: (points) => points.filter((it) => it.endDate.getTime() < Date.now()),
};
