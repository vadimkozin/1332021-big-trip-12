import {formatDate as format} from '../utils';
export const createDayInfoTemplate = (date) =>
  `<div class="day__info">
    <span class="day__counter">1</span>
    <time class="day__date" datetime="${format.ymd(date)}">${format.md(date)}</time>
  </div>`;
