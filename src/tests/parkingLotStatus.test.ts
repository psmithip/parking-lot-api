import request from 'supertest';
import { app } from '../app';
import { clearDataInTestTable } from '../utils/database';

describe('GET /api/parking-lot-status/:id', () => {
  beforeAll(async () => {
    await clearDataInTestTable();
  });

  test('should return 200 with expected data', async () => {
    const response = await request(app).post('/api/parking-lot').send({
      name: 'parking1',
      totalSlots: 10,
    });
    const parkingLotId = response.body.data.parkingLotId;

    const resParkingLotStatus = await request(app).get(`/api/parking-lot-status/${parkingLotId}`).expect(200);
    expect(resParkingLotStatus.body).toHaveProperty('message', 'success');
    expect(resParkingLotStatus.body.data.length).toEqual(10);
  });

  test('should return 400 if parkingLotId is invalid', async () => {
    const response = await request(app).get(`/api/parking-lot-status/555`).expect(400);
    expect(response.body).toHaveProperty('message', `cannot get parking lot status | parkingLotId: 555`);
  });
});
