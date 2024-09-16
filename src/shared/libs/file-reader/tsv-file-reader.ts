import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, HouseType, City, Good, Location } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      postDate,
      cityName,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      houseType,
      bedrooms,
      guests,
      price,
      goods,
      authorEmail,
      commentsCount,
      latitude,
      longitude,
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: this.parseCity(cityName),
      previewImage,
      images: this.parseImages(images),
      isPremium: (isPremium === 'true'),
      isFavorite: (isFavorite === 'true'),
      rating: this.parseRating(rating),
      type: HouseType[houseType as 'apartment' | 'house' | 'room' | 'hotel'],
      bedrooms: Number.parseInt(bedrooms, 10),
      guests: Number.parseInt(guests, 10),
      price: this.parsePrice(price),
      authorEmail,
      commentsCount: this.parseCommentsCount(commentsCount),
      goods: this.parseGoods(goods),
      location: this.parseLocation(latitude, longitude),
    };
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    };
  }

  private parseCity(cityName: string): City {
    return {
      title: cityName,
      location: {
        latitude: 0,
        longitude: 0
      }
    };
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';').map((item) => item);
  }

  private parseGoods(goodsString: string): Good[] {
    return goodsString.split(';').map((item) => Good[item as 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge']);
  }

  private parsePrice(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseCommentsCount(commentsCountString: string): number {
    return Number.parseInt(commentsCountString, 10);
  }

  private parseRating(ratingString: string): number {
    return Number.parseFloat(ratingString);
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
