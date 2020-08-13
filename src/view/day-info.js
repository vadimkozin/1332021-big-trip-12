import {formatDate as format} from '../utils';
export const createDayInfoTemplate = (dayInOrder, date) =>
  `<div class="day__info">
    <span class="day__counter">${dayInOrder}</span>
    <time class="day__date" datetime="${format.ymd(date)}">${format.md(date)}</time>
  </div>`;
