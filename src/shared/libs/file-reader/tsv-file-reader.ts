import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, HouseType, User, City } from '../../types/index.js';

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
      type,
      bedrooms,
      guests,
      price,
      goods,
      authorEmail,
      commentsCount,
      location,
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
      type: HouseType[type as 'Apartment' | 'House' | 'Room' | 'Hotel'],
      bedrooms: Number.parseInt(bedrooms, 10),
      guests: Number.parseInt(guests, 10),

      categories: this.parseCategories(categories),
      price: this.parsePrice(price),
      user: this.parseUser(firstname, lastname, email, avatarPath),
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
    return imagesString.split(';').map((item) => (item));
  }

  private parsePrice(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseRating(ratingString: string): number {
    return Number.parseFloat(ratingString);
  }

  private parseUser(firstname: string, lastname: string, email: string, avatarPath: string): User {
    return { email, firstname, lastname, avatarPath };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
