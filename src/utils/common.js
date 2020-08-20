import {MONTHS, Time, Duration} from '../const';

// возвращает случайное число из диапазона между min и max (оба включены)
export const getRandomInteger = (min = 0, max = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// добавляет ведущие нули: ( '2' => '02')
export const addZeros = (number, digitsInNumber = 2) => {
  let n = String(number);
  while (n.length < digitsInNumber) {
    n = `0` + n;
  }
  return n;
};

// форматривание дат: dm:'AUG 25' md:'25 AUG' hm:'10:30' ymd:'2020-08-25'
// ymdhm:'2019-03-18T10:30' dmy:18/03/19 00:00
export const formatDate = {
  dm: (date) => `${date.getDate()} ${MONTHS[date.getMonth()]}`,
  md: (date) => `${MONTHS[date.getMonth()]} ${date.getDate()}`,
  hm: (date) => `${addZeros(date.getHours())}:${addZeros(date.getMinutes())}`,
  ymd: (date) => `${date.getFullYear()}-${addZeros(date.getMonth() + 1)}-${addZeros(date.getDate())}`,
  dmy: (date) => `${date.getDate()}/${addZeros(date.getMonth() + 1)}/${String(date.getFullYear()).slice(2)} ${formatDate.hm(date)}`,
  ymdhm: (date) => `${formatDate.ymd(date)}T${formatDate.hm(date)}`,
};

// замена в строке (по умолчанию меняет два тире на длинное тире в html)
export const replaceStr = (str, search = `--`, replace = `&nbsp;&mdash;&nbsp;`) => str.split(search).join(replace);

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

// возвращает случайную дату позднее чем lastDate,
// добавляя timeShift, одно из: ['minutes', 'hours', 'days', 'hoursminutes']
export const getNextRandomDate = (lastDate = Date.now(), timeShift = `hours`) => {
  const minutes = getRandomInteger(10, 59);
  const hours = getRandomInteger(1, 10);
  const days = getRandomInteger(1, 3);

  switch (timeShift) {
    case Time.ADD_MINUTES:
      return new Date(lastDate.valueOf() + minutes * Duration.MSEC_PER_MINUTE);
    case Time.ADD_HOURS:
      return new Date(lastDate.valueOf() + hours * Duration.MSEC_PER_HOUR);
    case Time.ADD_DAYS:
      return new Date(lastDate.valueOf() + days * Duration.MSEC_PER_DAY);
    case Time.ADD_HOURS_AND_MINUTES:
      return new Date(lastDate.valueOf() + hours * Duration.MSEC_PER_HOUR + minutes * Duration.MSEC_PER_MINUTE);
    default:
      return new Date(lastDate.valueOf() + hours * Duration.MSEC_PER_HOUR);
  }
};

// возвращает значения из массива объектов по ключуы
export const getValuesByKey = ({key, arrayObj} = {}) => {
  return arrayObj.reduce((array, it) => {
    array.push(it[key]);
    return array;
  }, []);
};
