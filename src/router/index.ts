import express, { Request, Response } from 'express';
import { ParkingLotController } from '../controllers/parkingLotController';

export const router = express.Router();

router.get('/health-check', (req: Request, res: Response) => res.json({ message: 'OK' }));
router.post('/parking-lot', ParkingLotController.createParkingLot);
router.get('/parking-lot-status/:id', ParkingLotController.getParkingLotStatus);
