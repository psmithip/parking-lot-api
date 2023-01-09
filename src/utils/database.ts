import { dbConn } from '../database';

export const clearDataInTestTable = async () => {
  for (const tableName of ['ticket', 'slot', 'parkingLot']) {
    await dbConn.table(tableName).del();
  }
};
