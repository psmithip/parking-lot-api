import { Knex } from 'knex';
import { dbConn } from '../database';

export namespace SlotRepo {
  const slotTable = 'slot';

  export const bulkCreate = async (data: { parkingLotId: number; position: number }[]): Promise<void> => {
    return dbConn.table(slotTable).insert(data);
  };

  export const getNearestAvailableSlot = (parkingLotId: number): Promise<{ id: number }> => {
    return dbConn
      .table(slotTable)
      .column('id')
      .where({ parkingLotId, isAvailable: true })
      .orderBy('position', 'asc')
      .first();
  };

  export const updateById = async (
    slotId: number,
    data: { parkingLotId?: number; position?: number; isAvailable?: boolean },
    transaction?: Knex.Transaction
  ): Promise<void> => {
    return (transaction || dbConn).table(slotTable).where({ id: slotId }).update(data);
  };
}
