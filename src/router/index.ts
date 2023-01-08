import express, { Request, Response } from 'express';
import { ParkingLotController } from '../controllers/parkingLotController';
import { TicketController } from '../controllers/ticketController';

export const router = express.Router();

router.get('/health-check', (req: Request, res: Response) => res.json({ message: 'OK' }));
router.post('/parking-lot', ParkingLotController.createParkingLot);
router.post('/park-car', TicketController.parkCar);
router.post('/leave-slot', TicketController.leaveSlot);
router.get('/parking-lot-status/:id', ParkingLotController.getParkingLotStatus);
