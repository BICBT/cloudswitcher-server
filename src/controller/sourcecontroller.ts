import { Request, Response } from 'express';
import * as obs from 'obs-node';
import { StatusCodes } from 'http-status-codes';
import { UpdateSourceRequest } from 'obs-node';

export const sourceController = new class SourceController {

  public get(req: Request, res: Response) {
    req.checkParams('sceneId', 'sceneId is not valid').isString().notEmpty();
    req.checkParams('sourceId', 'sourceId is not valid').isString().notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
      return;
    }
    try {
      const sceneId: string = req.params.sceneId;
      const sourceId: string = req.params.sourceId;
      res.status(StatusCodes.OK).json(obs.getSource(sceneId, sourceId));
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public update(req: Request, res: Response) {
    req.checkParams('sceneId', 'sceneId is not valid').isString().notEmpty();
    req.checkParams('sourceId', 'sourceId is not valid').isString().notEmpty();
    req.checkBody('url', 'url is not valid').isString().notEmpty().optional();
    req.checkBody('volume', 'volume is not valid').isNumeric().optional();
    req.checkBody('audioLock', 'audioLock is not valid').isBoolean().optional();
    req.checkBody('audioMonitor', 'audioMonitor is not valid').isBoolean().optional();
    const errors = req.validationErrors();
    if (errors) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
      return;
    }
    try {
      const sceneId: string = req.params.sceneId;
      const sourceId: string = req.params.sourceId;
      const request: UpdateSourceRequest = req.body;
      obs.updateSource(sceneId, sourceId, request);
      res.status(StatusCodes.OK).json(obs.getSource(sceneId, sourceId));
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }
}
