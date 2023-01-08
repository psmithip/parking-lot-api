import { Knex } from 'knex';
import { dbConn } from '../database';
import { carSizeEnum } from '../enums/carSizeEnum';

export namespace TicketRepo {
  const ticketTable = 'ticket';
  const slotTable = 'slot';

  export const getRegistrationAllocatedData = async (
    parkingLotId: number,
    carSize: keyof typeof carSizeEnum
  ): Promise<{ slotId: number; plateNumber: string }[]> => {
    return dbConn
      .table(ticketTable)
      .column(`${slotTable}.id as slotId`, `${ticketTable}.plateNumber`)
      .join(slotTable, `${slotTable}.id`, `${ticketTable}.slotId`)
      .where(`${slotTable}.parkingLotId`, parkingLotId)
      .where(`${ticketTable}.carSize`, carSize)
      .whereNull(`${ticketTable}.exitAt`)
      .where(`${slotTable}.isAvailable`, false);
  };

  export const getById = async (
    ticketId: number,
    transaction?: Knex.Transaction
  ): Promise<{
    id: number;
    entryAt: Date;
    exitAt: Date | null;
    plateNumber: string;
    carSize: keyof typeof carSizeEnum;
    slotId: number;
  }> => {
    return (transaction || dbConn).table(ticketTable).where({ id: ticketId }).first();
  };

  export const create = async (
    data: { plateNumber: string; carSize: keyof typeof carSizeEnum; slotId: number },
    transaction?: Knex.Transaction
  ): Promise<number> => {
    const id = (await (transaction || dbConn).table(ticketTable).insert(data))[0];
    return id;
  };

  export const updateById = async (
    ticketId: number,
    data: { entryAt?: Date; exitAt?: Date; plateNumber?: string; carSize?: keyof typeof carSizeEnum; slotId?: number },
    transaction?: Knex.Transaction
  ): Promise<void> => {
    return (transaction || dbConn).table(ticketTable).where({ id: ticketId }).update(data);
  };
}
