import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as obs from 'obs-node';
import { Overlay } from 'obs-node';

export const overlayController = new class OverlayController {

  public getOverlays(req: Request, res: Response) {
    try {
      res.status(StatusCodes.OK).json(obs.getOverlays());
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public addOverlay(req: Request, res: Response) {
    try {
      obs.addOverlay(req.body as Overlay);
      res.status(StatusCodes.OK).end();
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public updateOverlay(req: Request, res: Response) {
    const overlayId = req.params.overlayId as string;
    try {
      obs.removeOverlay(overlayId);
      obs.addOverlay(req.body as Overlay);
      res.status(StatusCodes.OK).end();
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public removeOverlay(req: Request, res: Response) {
    const overlayId = req.params.overlayId as string;
    try {
      obs.removeOverlay(overlayId);
      res.status(StatusCodes.NO_CONTENT).end();
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public upOverlay(req: Request, res: Response) {
    const overlayId = req.params.overlayId as string;
    try {
      obs.upOverlay(overlayId);
      res.status(StatusCodes.OK).end();
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  public downOverlay(req: Request, res: Response) {
    const overlayId = req.params.overlayId as string;
    try {
      obs.downOverlay(overlayId);
      res.status(StatusCodes.OK).end();
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }
};
