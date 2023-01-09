import { NextFunction, Request, Response } from 'express';
import { statusCodeEnum } from '../enums/statusCodeEnum';
import { ParkingLotService } from '../services/parkingLotService';
import { CustomError } from '../utils/customError';

export namespace ParkingLotController {
  export const createParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    const name: string = req.body.name;
    const totalSlots: number = req.body.totalSlots;

    try {
      const parkingLotId = await ParkingLotService.createParkingLot(name, totalSlots);
      res.json({ message: 'success', data: { parkingLotId } });
    } catch (error) {
      next(new CustomError({ message: 'cannot create a new parking lot', statusCode: statusCodeEnum.BAD_REQUEST }));
    }
  };

  export const getParkingLotStatus = async (req: Request, res: Response, next: NextFunction) => {
    const parkingLotId: number = parseInt(req.params.id);

    try {
      const data = await ParkingLotService.getParkingLotStatus(parkingLotId);

      if (!data.length) {
        throw new Error('not found');
      }

      res.json({ message: 'success', data });
    } catch (error) {
      next(
        new CustomError({
          message: `cannot get parking lot status | parkingLotId: ${parkingLotId}`,
          statusCode: statusCodeEnum.BAD_REQUEST,
        })
      );
    }
  };
}
