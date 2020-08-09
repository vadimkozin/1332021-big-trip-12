const Atom = {
  MONTHS: [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`],
  Time: {
    ADD_MINUTES: `minutes`,
    ADD_HOURS: `hours`,
    ADD_DAYS: `days`
  },
  Duration: {
    MSEC_PER_MINUTE: 60 * 1000, // миллисекунд в минуте
    MSEC_PER_HOUR: 60 * 60 * 1000, // миллисекунд в часе
    MSEC_PER_DAY: 60 * 60 * 1000 * 24, // миллисекунд в сутках
  },
};

// возвращает случайное число из диапазона
export const getRandomInteger = (from = 0, to = 0) => {
  const range = Number(to) - Number(from) + 1;
  return from + Math.floor(Math.random() * range);
};

// добавляет веущие нули: ( '2' => '02')
const addZeros = (n, needLength = 2) => {
  n = String(n);
  while (n.length < needLength) {
    n = `0` + n;
  }
  return n;
};

// форматривание дат: ymd:'2020-08-25', md:'25 AUG', dm:'AUG 25'
// ymdhm:'2019-03-18T10:30', hm:'10:30'
export const formatDate = {
  dm: (date) => `${date.getDate()} ${Atom.MONTHS[date.getMonth()]}`,
  md: (date) => `${Atom.MONTHS[date.getMonth()]} ${date.getDate()}`,
  hm: (date) => `${addZeros(date.getHours)}:${addZeros(date.getMinutes)}`,
  ymd: (date) => `${date.getFullYear()}-${addZeros(date.getMonth() + 1)}-${addZeros(date.getDate())}`,
  ymdhm: (date) => `${formatDate.ymd(date)}T${formatDate.hm(date)}`,
  ymdhm_: (date) => `${date.getFullYear()}-${addZeros(date.getMonth() + 1)}-${addZeros(date.getDate())}T${addZeros(date.getHours())}:${addZeros(date.getMinutes)}`,
};

// возвращает продолжительность маршрута в формате: "23M" or "02H 44M" or "01D 02H 30M"
const getDurationRoute = (milliseconds) => {
  const {Duration: dur} = Atom;
  const _hours = milliseconds / dur.MSEC_PER_HOUR;
  const _days = milliseconds / dur.MSEC_PER_DAY;

  if (_hours < 1) { // "23M"
    return `${addZeros(Math.floor(milliseconds / dur.MSEC_PER_MINUTE))}M`;

  } else if (_days < 1) { // "02H 44M"
    const hours = Math.floor(milliseconds / dur.MSEC_PER_HOUR);
    const msec = milliseconds - hours * dur.MSEC_PER_HOUR;
    const minutes = msec / dur.MSEC_PER_MINUTE;
    return `${addZeros(Math.floor(hours))}H ${addZeros(Math.floor(minutes))}M`;

  } else { // "01D 02H 30M"
    const days = Math.floor(milliseconds / dur.MSEC_PER_DAY);
    let msec = milliseconds - days * dur.MSEC_PER_DAY;
    const hours = Math.floor(msec / dur.MSEC_PER_HOUR);
    msec -= hours * dur.MSEC_PER_HOUR;
    const minutes = msec / dur.MSEC_PER_MINUTE;
    return `${addZeros(Math.floor(days))}D ${addZeros(Math.floor(hours))}H ${addZeros(Math.floor(minutes))}M`;
  }
};

// возвращает время маршрута в формате: начало-окончание: '10:30 - 11:00'
const getTimeRoute = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);

  const begin = `${addZeros(dt1.getHours())}:${addZeros(dt1.getMinutes())}`;
  const end = `${addZeros(dt2.getHours())}:${addZeros(dt2.getMinutes())}`;

  return `${begin} - ${end}`;
};

// возвращает разницу date2-date1 в виде объекта {time, duration}
// например:  {time: '10:30-11:00', duration: '30М'}
export const getTimeAndDuration = (date1 = new Date(), date2 = new Date()) => {
  return {
    duration: getDurationRoute(date2 - date1),
    time: getTimeRoute(date1, date2),
  };
};
// const time = getTimeAndDuration(Date.now(), new Date(Date.now() + 49 * 60 * 60 * 1000 + 60*11*1000));
// console.log(time);


// возвращает случайную дату позднее чем lastDate,
// добавляя timeShift, одно из: ['minutes', 'hours', 'days']
export const getNextRandomDate = (lastDate = Date.now(), timeShift = `hours`) => {
  const minutes = getRandomInteger(10, 59);
  const hours = getRandomInteger(1, 23);
  const days = getRandomInteger(1, 3);
  const {Duration: dur} = Atom;

  switch (timeShift) {
    case Atom.Time.ADD_MINUTES:
      return new Date(lastDate.valueOf() + minutes * dur.MSEC_PER_MINUTE);
    case Atom.Time.ADD_HOURS:
      return new Date(lastDate.valueOf() + hours * dur.MSEC_PER_HOUR);
    case Atom.Time.ADD_DAYS:
      return new Date(lastDate.valueOf() + days * dur.MSEC_PER_DAY);
    default:
      return new Date(lastDate.valueOf() + hours * dur.MSEC_PER_HOUR);
  }
};

// возвращает случайные предложения из текста
export const getRandomSentences = (text, separator = `.`, from = 1, to = 5) => {
  const countSentences = getRandomInteger(from, to);
  const sentences = text.split(separator);
  const result = [];

  for (let i = 0; i < countSentences; i++) {
    const index = getRandomInteger(0, sentences.length - 1);
    result.push(sentences[index]);
  }

  return result.join(separator).trim();

};

// возвращает массив случайных фото
export const getRandomPhotos = (url, from = 1, to = 5) => {

  const count = getRandomInteger(from, to);

  return Array(count).fill().map(() => `${url}${Math.random()}`);

};

// возвращает продолжительность маршрута в виде: "18 AUG--6 OCT" или "MAR 18--20"
const getDuration = (date1, date2, separator = `--`) => {

  const inOneMonth = date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  const inDay = inOneMonth && date1.getDate() === date2.getDate();

  if (inDay) { // 18 AUG
    return `${formatDate.dm(date1)}`;
  } else if (inOneMonth) { // AUG 18--20
    return `${Atom.MONTHS[date1.getMonth()]} ${date1.getDate()}${separator}${date2.getDate()}`;
  } else { // 18 AUG--6 OCT
    return `${Atom.MONTHS[date1.getMonth()]} ${date1.getDate()}${separator}${date2.getDate()} ${Atom.MONTHS[date2.getMonth()]}`;
  }

};

// замена в строке
export const replaceStr = (str, search = `--`, replace = `&nbsp;&mdash;&nbsp;`) => str.split(search).join(replace);

export const getDaysRoute = (points) => {
  const days = points.reduce((orders, it) => {
    orders.push(it.order);
    return orders;
  }, []);

  return [...new Set(days)];
};

// возвращает инфо по маршруту
export const getRouteInfo = (route) => {
  const separator = `--`;
  const points = route.slice().sort((a, b) => a.date1 > b.date1);
  const begin = formatDate.dm(points[0].date1).toUpperCase();
  const end = formatDate.dm(points[points.length - 1].date2).toUpperCase();
  const duration = getDuration(points[0].date1, points[points.length - 1].date2).toUpperCase();

  // список городов(пунктов назначения) в хронологическом порядке
  const cities = points.reduce((acc, it) => {
    acc.push(`${it.destination}`);
    return acc;
  }, []);

  let nameRoute = ``;

  nameRoute = cities.length <= 3
    ? cities.join(separator)
    : `${cities[0]}${separator}...${separator}${cities[cities.length - 1]}`;

  const total = points.reduce((sum, it) =>
    sum + it.price + it.offers.reduce((sumOffer, offer) => sumOffer + offer.price, 0)
  , 0);

  return {
    nameRoute,
    begin,
    end,
    duration,
    total
  };
};

// сортировка по: дням, цене и продолжительности
export const sortRoute = {
  days: (points) => points.sort((a, b) => a.date1 - b.date1),
  price: (points) => points.sort((a, b) => b.price - a.price),
  time: (points) => points.sort((a, b) => (b.date2 - b.date1) - (a.date2 - a.date1)),
};

// фильтры: всё, запланированно, пройдено
export const filterRoute = {
  everything: (points) => points,
  future: (points) => points.filter((it) => it.date1.getTime() > Date.now()),
  past: (points) => points.filter((it) => it.date2.getTime() < Date.now()),
};

// установка порядкового номера дня для каждой точки маршрута
export const setOrdinalDaysRoute = (points) => {
  let order = 1;

  points.sort((a, b) => a.date1 - b.date1);

  let currentDay = formatDate.ymd(points[0].date1);

  return points.map((it) => {

    const day = formatDate.ymd(it.date1);

    if (day === currentDay) {
      it.order = order;
    } else {
      it.order = ++order;
      currentDay = day;
    }

    return it;
  });
};
