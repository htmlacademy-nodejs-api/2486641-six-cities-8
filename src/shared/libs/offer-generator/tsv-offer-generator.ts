import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { HouseType } from '../../types/house-type.enum.js';
import { Cities } from '../../../const.js';
import { Good } from '../../types/good.enum.js';
import { BedroomsCount, CommentsCount, GuestsCount, Price, Rating } from './const.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

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
    const price = generateRandomValue(Price.Min, Price.Max).toString();
    const bedroomsCount = generateRandomValue(BedroomsCount.Min, BedroomsCount.Max).toString();
    const guestsCount = generateRandomValue(GuestsCount.Min, GuestsCount.Min).toString();
    const rating = generateRandomValue(Rating.Min, Rating.Max, 1).toString();
    const goods = getRandomItems<string>(Object.values(Good));
    const images = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem<boolean>([true, false]);
    const isFavorite = getRandomItem<boolean>([true, false]);
    const commentsCount = generateRandomValue(CommentsCount.Min, CommentsCount.Max).toString();
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
