import { ParkingLotRepo } from '../repositories/parkingLotRepo';
import { SlotRepo } from '../repositories/slotRepo';

export namespace ParkingLotService {
  export const createParkingLot = async (name: string, totalSlots: number): Promise<number> => {
    const parkingLotId: number = await ParkingLotRepo.create(name);
    const slotList: { parkingLotId: number; position: number }[] = [];

    for (let position = 1; position <= totalSlots; position++) {
      slotList.push({ parkingLotId, position });
    }

    await SlotRepo.bulkCreate(slotList);
    return parkingLotId;
  };

  export const getParkingLotStatus = async (
    parkingLotId: number
  ): Promise<
    {
      parkingLotName: string;
      slotId: number;
      slotIsAvailable: boolean;
      slotPosition: number;
      ticketId: number | null;
      ticketEntryAt: Date | null;
      ticketExitAt: Date | null;
      plateNumber: string | null;
      carSize: string | null;
    }[]
  > => {
    return ParkingLotRepo.getParkingLotDetailById(parkingLotId);
  };
}
