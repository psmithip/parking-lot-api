import { ParkingLotRepo } from '../repositories/parkingLotRepo';
import { SlotRepo } from '../repositories/slotRepo';

export namespace ParkingLotService {
  export const createParkingLot = async (name: string, totalSlots: number): Promise<void> => {
    const parkingLotId: number = await ParkingLotRepo.create(name);
    const slotList: { parkingLotId: number; position: number }[] = [];

    for (let position = 1; position <= totalSlots; position++) {
      slotList.push({ parkingLotId, position });
    }

    return await SlotRepo.bulkCreate(slotList);
  };
}
