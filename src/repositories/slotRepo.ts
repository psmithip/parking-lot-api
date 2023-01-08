import { dbConn } from '../database';

export namespace SlotRepo {
  const slotTable = 'slot';

  export const bulkCreate = async (data: { parkingLotId: number; position: number }[]): Promise<void> => {
    return dbConn.table(slotTable).insert(data);
  };
}
