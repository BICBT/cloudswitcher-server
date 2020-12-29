import { Request, Response } from 'express';
import * as obs from 'obs-node';
import { StatusCodes } from 'http-status-codes';
import { UpdateAudioRequest } from 'obs-node';

export const audioController = new class AudioController {

  public get(req: Request, res: Response) {
    try {
      res.status(StatusCodes.OK).json(obs.getAudio());
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public update(req: Request, res: Response) {
    req.checkBody('masterVolume', 'masterVolume is not valid').isNumeric().optional();
    req.checkBody('audioWithVideo', 'audioWithVideo is not valid').isBoolean().optional();
    const errors = req.validationErrors();
    if (errors) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: errors });
      return;
    }
    try {
      obs.updateAudio(req.body as UpdateAudioRequest)
      res.status(StatusCodes.OK).json(obs.getAudio());
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }
}
