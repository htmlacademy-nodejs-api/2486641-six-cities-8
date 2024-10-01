import { FileReader } from './file-reader.interface.js';
import { Offer, HouseType, City, Good, Location } from '../../types/index.js';
import { Cities } from '../../../const.js';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
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
      isPremium: this.parseStringToBoolean(isPremium),
      isFavorite: this.parseStringToBoolean(isFavorite),
      rating: this.parseRating(rating),
      type: HouseType[houseType as 'apartment' | 'house' | 'room' | 'hotel'],
      bedroomsCount: this.parseBedroomsCount(bedrooms),
      guestsCount: this.parseGuestsCount(guests),
      price: this.parsePrice(price),
      authorEmail,
      commentsCount: this.parseCommentsCount(commentsCount),
      goods: this.parseGoods(goods),
      location: this.parseLocation(latitude, longitude),
    };
  }

  private parseStringToBoolean(value: string): boolean {
    return (value === 'true');
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    };
  }

  private parseBedroomsCount(countString: string): number {
    return Number.parseInt(countString, 10);
  }

  private parseGuestsCount(countString: string): number {
    return Number.parseInt(countString, 10);
  }

  private parseCity(cityName: string): City {
    return Cities.find((item) => {
      if (item) {
        return (item.name === cityName);
      }
      return undefined;
    });
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';').map((item) => item);
  }

  private parseGoods(goodsString: string): Good[] {
    // Оно конечно работает, но код выглядит неоптимальным и плохо читаемым
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }
    this.emit('end', importedRowCount);
  }
}
