import { WeatherData } from './types';

export const MOCK_WEATHER: WeatherData = {
  temp: 24,
  humidity: 45,
  condition: 'Quyoshli',
  windSpeed: 12,
  date: new Date().toLocaleDateString('uz-UZ')
};

export const SOIL_TYPES = [
  'Qora tuproq (Chernozem)',
  'Qumloq (Sandy)',
  'Gil tuproq (Clay)',
  'Sho\'rlangan (Saline)',
  'Bo\'z tuproq (Serozem)'
];

export const GOALS = [
  'Maksimal foyda (High Profit)',
  'Barqaror daromad (Stability)',
  'Kam xarajat (Low Cost)',
  'Eksport (Export potential)',
  'Tuproq unumdorligini oshirish'
];

export const SEASONS = [
  'Bahor (Mart-May)',
  'Yoz (Iyun-Avgust)',
  'Kuz (Sentabr-Noyabr)',
  'Qish (Dekabr-Fevral)'
];
