import request from 'supertest';
import { app } from '../app';
import { dbConn } from '../database';
import { clearDataInTestTable } from '../utils/database';

const parkingLotTable = 'parkingLot';
const slotTable = 'slot';

describe('POST /api/parking-lot', () => {
  beforeAll(async () => {
    await clearDataInTestTable();
  });

  test('should return 200 with expected data', async () => {
    const parkingLotName = 'parking1';
    const totalSlots = 10;
    const response = await request(app)
      .post('/api/parking-lot')
      .send({
        name: parkingLotName,
        totalSlots: 10,
      })
      .expect(200);
    expect(response.body).toHaveProperty('message', 'success');

    const parkingLotId = response.body.data.parkingLotId;
    const slotList = await dbConn
      .table(slotTable)
      .column(`${parkingLotTable}.name as parkingLotName`)
      .join(parkingLotTable, `${slotTable}.parkingLotId`, `${parkingLotTable}.id`)
      .where(`${slotTable}.parkingLotId`, parkingLotId);
    expect(slotList.length).toEqual(totalSlots);
    expect(slotList[0].parkingLotName).toEqual(parkingLotName);
  });

  test('should return 400 if create duplicate name', async () => {
    const response = await request(app)
      .post('/api/parking-lot')
      .send({
        name: 'parking1',
        totalSlots: 20,
      })
      .expect(400);
    expect(response.body).toHaveProperty('message', 'cannot create a new parking lot');
  });
});
