import { dbConn } from '../database';

export namespace ParkingLotRepo {
  const parkingLotTable = 'parkingLot';
  const slotTable = 'slot';
  const ticketTable = 'ticket';

  export const create = async (name: string): Promise<number> => {
    const id = (await dbConn.table(parkingLotTable).insert({ name }))[0];
    return id;
  };

  export const getParkingLotDetailById = async (
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
    return dbConn
      .table(parkingLotTable)
      .column(
        `${parkingLotTable}.name as parkingLotName`,
        `${slotTable}.id as slotId`,
        `${slotTable}.isAvailable as slotIsAvailable`,
        `${slotTable}.position as slotPosition`,
        `${ticketTable}.id as ticketId`,
        `${ticketTable}.entryAt as ticketEntryAt`,
        `${ticketTable}.exitAt as ticketExitAt`,
        `${ticketTable}.plateNumber`,
        `${ticketTable}.carSize`
      )
      .join(slotTable, `${parkingLotTable}.id`, `${slotTable}.parkingLotId`)
      .leftJoin(ticketTable, `${slotTable}.id`, `${ticketTable}.slotId`)
      .where(`${parkingLotTable}.id`, parkingLotId);
  };
}
