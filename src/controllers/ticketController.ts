import { NextFunction, Request, Response } from 'express';
import { carSizeEnum } from '../enums/carSizeEnum';
import { statusCodeEnum } from '../enums/statusCodeEnum';
import { TicketService } from '../services/ticketService';
import { CustomError } from '../utils/customError';

export namespace TicketController {
  export const parkCar = async (req: Request, res: Response, next: NextFunction) => {
    const parkingLotId: number = req.body.parkingLotId;
    const carInfo: { plateNumber: string; carSize: keyof typeof carSizeEnum } = req.body.carInfo;

    try {
      const ticketInfo = await TicketService.parkCar(parkingLotId, carInfo);
      res.json({ message: 'success', data: ticketInfo });
    } catch (error) {
      if (error.statusCode) {
        next(error);
      } else {
        next(
          new CustomError({
            message: `cannot park car | parkingLotId: ${parkingLotId}`,
            statusCode: statusCodeEnum.BAD_REQUEST,
          })
        );
      }
    }
  };

  export const leaveSlot = async (req: Request, res: Response, next: NextFunction) => {
    const ticketId: number = req.body.ticketId;

    try {
      await TicketService.leaveSlot(ticketId);
      res.json({ message: 'success' });
    } catch (error) {
      if (error.statusCode) {
        next(error);
      } else {
        next(
          new CustomError({
            message: `cannot leave slot | ticketId: ${ticketId}`,
            statusCode: statusCodeEnum.BAD_REQUEST,
          })
        );
      }
    }
  };
}
