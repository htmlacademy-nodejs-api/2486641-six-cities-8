import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { Request, Response } from 'express';

@injectable()
export class OfferController extends BaseController{
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ){
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/', handler: this.findAll, method: HttpMethod.Get});
  }

  public async findAll(_req: Request, res: Response): Promise<void> {
    const result = await this.offerService.findAll();
    this.ok(res, result);
  }
}
