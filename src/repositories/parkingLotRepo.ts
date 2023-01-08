import { dbConn } from '../database';

export namespace ParkingLotRepo {
  const parkingLotTable = 'parkingLot';

  export const create = async (name: string): Promise<number> => {
    const id = (await dbConn.table(parkingLotTable).insert({ name }))[0];
    return id;
  };
}
