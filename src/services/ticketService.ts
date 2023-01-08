import { Knex } from 'knex';
import { dbConn } from '../database';
import { carSizeEnum } from '../enums/carSizeEnum';
import { statusCodeEnum } from '../enums/statusCodeEnum';
import { SlotRepo } from '../repositories/slotRepo';
import { TicketRepo } from '../repositories/ticketRepo';
import { CustomError } from '../utils/customError';

export namespace TicketService {
  export const parkCar = async (
    parkingLotId: number,
    carInfo: { plateNumber: string; carSize: keyof typeof carSizeEnum }
  ): Promise<{
    id: number;
    entryAt: Date;
    exitAt: Date | null;
    plateNumber: string;
    carSize: keyof typeof carSizeEnum;
    slotId: number;
  }> => {
    const slotId = (await SlotRepo.getNearestAvailableSlot(parkingLotId))?.id;

    if (!slotId) {
      throw new CustomError({
        message: `cannot find available slot | parkingLotId: ${parkingLotId}`,
        statusCode: statusCodeEnum.NOT_FOUND,
      });
    }

    const transaction: Knex.Transaction = await dbConn.transaction();

    try {
      await SlotRepo.updateById(slotId, { isAvailable: false }, transaction);
      const ticketId = await TicketRepo.create({ ...carInfo, slotId }, transaction);
      const ticketInfo = await TicketRepo.getById(ticketId, transaction);
      await transaction.commit();
      return ticketInfo;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
