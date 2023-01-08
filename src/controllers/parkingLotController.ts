import { NextFunction, Request, Response } from 'express';
import { statusCodeEnum } from '../enums/statusCodeEnum';
import { ParkingLotService } from '../services/parkingLotService';
import { CustomError } from '../utils/customError';

export namespace ParkingLotController {
  export const createParkingLot = async (req: Request, res: Response, next: NextFunction) => {
    const name: string = req.body.name;
    const totalSlots: number = req.body.totalSlots;

    try {
      await ParkingLotService.createParkingLot(name, totalSlots);
      res.json({ message: 'success' });
    } catch (error) {
      next(new CustomError({ message: 'cannot create a new parking lot', statusCode: statusCodeEnum.BAD_REQUEST }));
    }
  };
}
