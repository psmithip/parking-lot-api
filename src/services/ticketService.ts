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
        message: `cannot find available slot | parkingLotId: ${parkingLotId}, plateNumber: ${carInfo.plateNumber}, carSize: ${carInfo.carSize}`,
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

  export const leaveSlot = async (ticketId: number): Promise<void> => {
    const ticketInfo = await TicketRepo.getById(ticketId);

    if (!ticketInfo) {
      throw new CustomError({
        message: `ticket is not found | ticketId: ${ticketId}`,
        statusCode: statusCodeEnum.NOT_FOUND,
      });
    } else if (ticketInfo.exitAt) {
      throw new CustomError({
        message: `car is already left slot | ticketId: ${ticketId}`,
        statusCode: statusCodeEnum.BAD_REQUEST,
      });
    }

    const transaction: Knex.Transaction = await dbConn.transaction();

    try {
      await TicketRepo.updateById(ticketId, { exitAt: new Date() }, transaction);
      await SlotRepo.updateById(ticketInfo.slotId, { isAvailable: true }, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  export const getRegistrationPlateNumber = async (
    parkingLotId: number,
    carSize: keyof typeof carSizeEnum
  ): Promise<string[]> => {
    return (await TicketRepo.getRegistrationAllocatedData(parkingLotId, carSize)).map((obj) => obj.plateNumber);
  };

  export const getRegistrationAllocatedSlot = async (
    parkingLotId: number,
    carSize: keyof typeof carSizeEnum
  ): Promise<number[]> => {
    return (await TicketRepo.getRegistrationAllocatedData(parkingLotId, carSize)).map((obj) => obj.slotId);
  };
}
