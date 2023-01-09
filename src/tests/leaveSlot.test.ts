import request from 'supertest';
import { app } from '../app';
import { carSizeEnum } from '../enums/carSizeEnum';
import { clearDataInTestTable } from '../utils/database';

let ticketId: number;

describe('POST /api/leave-slot', () => {
  beforeAll(async () => {
    await clearDataInTestTable();

    const response = await request(app).post('/api/parking-lot').send({
      name: 'parking1',
      totalSlots: 1,
    });
    const parkingLotId = response.body.data.parkingLotId;

    const resTicket = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber: 'ABC-1234', carSize: carSizeEnum.SMALL },
      });
    ticketId = resTicket.body.data.id;
  });

  test('should return 200 with success message', async () => {
    const response = await request(app).post('/api/leave-slot').send({ ticketId }).expect(200);
    expect(response.body).toHaveProperty('message', 'success');
  });

  test('should return 400 if car is already left slot', async () => {
    const response = await request(app).post('/api/leave-slot').send({ ticketId }).expect(400);
    expect(response.body).toHaveProperty('message', `car is already left slot | ticketId: ${ticketId}`);
  });

  test('should return 404 if ticket is not found', async () => {
    const response = await request(app).post('/api/leave-slot').send({ ticketId: 555 }).expect(404);
    expect(response.body).toHaveProperty('message', `ticket is not found | ticketId: 555`);
  });
});
