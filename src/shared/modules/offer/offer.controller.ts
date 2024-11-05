import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestQuery, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { Request, Response } from 'express';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { fillDTO } from '../../helpers/common.js';
import { ShowOfferRdo } from './rdo/show-offer.rdo.js';
import { IndexOfferRdo } from './rdo/index-offer.rdo.js';
import { ParamCityName } from './type/param-cityname.type.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { StatusCodes } from 'http-status-codes';
import { CreateCommentDto } from '../comment/index.js';

@injectable()
export class OfferController extends BaseController{
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ){
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/', handler: this.index, method: HttpMethod.Get});
    this.addRoute({
      path: '/',
      handler: this.create,
      method: HttpMethod.Post,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      handler: this.show,
      method: HttpMethod.Get,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      handler: this.update,
      method: HttpMethod.Patch,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      handler: this.delete,
      method: HttpMethod.Delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({path: '/:cityName/premium', handler: this.getPremiumByCity, method: HttpMethod.Get});
    this.addRoute({
      path: '/:offerId/comments',
      handler: this.getComments,
      method: HttpMethod.Get,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });

  }

  public async index(
    { query, tokenPayload }: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const userId = tokenPayload?.id ?? undefined;
    const result = await this.offerService.findAll(userId, query.limit);
    this.ok(res, fillDTO(ShowOfferRdo, result));
  }

  public async create(
    { body, tokenPayload }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({...body, userId: tokenPayload.id});
    this.created(res, fillDTO(ShowOfferRdo, result));
  }

  public async show(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const userId = tokenPayload?.id ?? undefined;
    const result = await this.offerService.findById(offerId, userId);
    this.ok(res, fillDTO(ShowOfferRdo, result));
  }

  public async update(
    { body, params, tokenPayload }: Request<ParamOfferId, unknown, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const userId = tokenPayload.id;
    const owner = await this.offerService.checkOwner(offerId, userId);
    if (!owner) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Can\'t update. You\'re not the owner', 'OfferController');
    }
    const result = await this.offerService.update(offerId, body);
    this.created(res, fillDTO(ShowOfferRdo, result));
  }

  public async delete(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload.id;
    const owner = await this.offerService.checkOwner(offerId, userId);
    if (!owner) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Can\'t delete. You\'re not the owner', 'OfferController');
    }
    const result = await this.offerService.delete(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, result);
  }

  public async getPremiumByCity({ params }: Request<ParamCityName>, res: Response): Promise<void> {
    const result = await this.offerService.findPremiumByCity(params.cityName);
    this.ok(res, fillDTO(IndexOfferRdo, result));
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const result = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, result));
  }

  public async createComment(
    {body, params, tokenPayload}: Request<ParamOfferId, unknown, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const offerId = params.offerId;
    const result = await this.commentService.create({...body, userId: tokenPayload.id, offerId: offerId});
    await this.offerService.incCommentCount(offerId);
    this.created(res, fillDTO(CommentRdo, result));
  }
}
