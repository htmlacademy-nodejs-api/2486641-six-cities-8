import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { Request, Response } from 'express';
import { CreateOfferDto } from './dto/create-offer.dto.js';

@injectable()
export class OfferController extends BaseController{
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ){
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/', handler: this.index, method: HttpMethod.Get});
    this.addRoute({path: '/', handler: this.create, method: HttpMethod.Post});
    this.addRoute({path: '/:id', handler: this.show, method: HttpMethod.Get});
    this.addRoute({path: '/:id', handler: this.update, method: HttpMethod.Put});
    this.addRoute({path: '/:id', handler: this.delete, method: HttpMethod.Delete});
    this.addRoute({path: '/:id/change-favorite', handler: this.changeIsFavorite, method: HttpMethod.Patch});
    this.addRoute({path: '/:cityName/premium', handler: this.getPremiumByCity, method: HttpMethod.Get});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.offerService.findAll();
    this.ok(res, result);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async show(req: Request, res: Response): Promise<void> {
    const result = await this.offerService.findById(req.params.id);
    this.ok(res, result);
  }

  public async update(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.update(req.params.id, req.body);
    this.created(res, result);
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.delete(req.params.id);
    this.noContent(res, result);
  }

  public async changeIsFavorite(
    req: Request,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.changeFavorite(req.params.id);
    this.created(res, result);
  }

  public async getPremiumByCity(req: Request, res: Response): Promise<void> {
    const result = await this.offerService.findPremiumByCity(req.params.cityName);
    this.ok(res, result);
  }
}
