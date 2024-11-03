import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, RequestQuery, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { Request, Response } from 'express';
import { IndexOfferRdo } from '../offer/rdo/index-offer.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { ShowOfferRdo } from '../offer/rdo/show-offer.rdo.js';

@injectable()
export class FavoriteController extends BaseController{
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    //@inject(Component.CommentService) private readonly commentService: CommentService
  ){
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      handler: this.index,
      method: HttpMethod.Get,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:offerId',
      handler: this.changeFavoriteStatus,
      method: HttpMethod.Post,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      handler: this.changeFavoriteStatus,
      method: HttpMethod.Delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index(
    { tokenPayload }: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.findFavorite(tokenPayload.id);
    this.ok(res, fillDTO(IndexOfferRdo, result));
  }

  public async changeFavoriteStatus(req: Request, res: Response): Promise<void> {
    const result = await this.offerService.changeFavorite(req.params.offerId);
    this.created(res, fillDTO(ShowOfferRdo, result));
  }
}
