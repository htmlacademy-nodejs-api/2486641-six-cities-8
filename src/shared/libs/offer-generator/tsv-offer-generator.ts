import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { HouseType } from '../../types/house-type.enum.js';
import { Cities } from '../../../const.js';
import { Good } from '../../types/good.enum.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 100;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const type = getRandomItem(Object.values(HouseType));
    const authorEmail = getRandomItem(this.mockData.emails);
    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const cityName = getRandomItem<string | undefined>(Cities.map((value) => value?.name));
    const previewImage = getRandomItem<string>(this.mockData.images);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const bedroomsCount = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS).toString();
    const guestsCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const goods = getRandomItems<string>(Object.values(Good));
    const images = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem<boolean>([true, false]);
    const isFavorite = getRandomItem<boolean>([true, false]);
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const latitude = generateRandomValue(-90, 90, 5).toString();
    const longitude = generateRandomValue(-180, 180, 5).toString();

    return [
      title, description, postDate,
      cityName, previewImage, images,
      isPremium, isFavorite, rating,
      type, bedroomsCount, guestsCount,
      price, goods, authorEmail,
      commentsCount, latitude, longitude
    ].join('\t');
  }
}
