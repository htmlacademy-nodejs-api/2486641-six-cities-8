import { getErrorMessage } from '../../shared/helpers/common.js';
import { getMongoURI } from '../../shared/helpers/database.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/offer.type.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);
    console.log(offer);
    await this.offerService.create({
      userId: user.id,
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      price: offer.price,
      type: offer.type,
      bedroomsCount: offer.bedroomsCount,
      cityName: offer.city?.name ?? 'Paris',
      commentsCount: offer.commentsCount,
      goods: offer.goods,
      guestsCount: offer.guestsCount,
      images: offer.images,
      isFavorite: offer.isFavorite,
      isPremium: offer.isPremium,
      location: offer.location,
      previewImage: offer.previewImage,
      rating: offer.rating
    });

  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {

      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
