import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Request, Response } from 'express';
import { OfferService } from '../offer/offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) protected readonly commentService: CommentService,
    @inject(Component.OfferService) protected readonly offerService: OfferService
  ){
    super(logger);
    this.logger.info('Register routes for CommentController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async create(
    {body, tokenPayload}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = body;
    const offer = await this.offerService.exists(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id=${offerId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    const result = await this.commentService.create({...body, userId: tokenPayload.id});
    await this.offerService.incCommentCount(offerId);
    this.created(res, result);
  }
}
