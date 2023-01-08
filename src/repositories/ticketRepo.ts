import { Knex } from 'knex';
import { dbConn } from '../database';
import { carSizeEnum } from '../enums/carSizeEnum';

export namespace TicketRepo {
  const ticketTable = 'ticket';

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
}
