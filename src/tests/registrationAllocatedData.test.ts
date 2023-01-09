import request from 'supertest';
import { app } from '../app';
import { carSizeEnum } from '../enums/carSizeEnum';
import { clearDataInTestTable } from '../utils/database';

const expectedPlateNumberForSmallSize = ['AB-123', 'CD-567', 'EF-890'];
const expectedPlateNumberForLargeSize = ['GH-555', 'XY-999'];
let parkingLotId: number;
const expectedSlotIdForSmallSize: number[] = [];
const expectedSlotIdForLargeSize: number[] = [];

beforeAll(async () => {
  await clearDataInTestTable();

  const response = await request(app).post('/api/parking-lot').send({
    name: 'parking1',
    totalSlots: 10,
  });
  parkingLotId = response.body.data.parkingLotId;

  for (const plateNumber of expectedPlateNumberForSmallSize) {
    const resTicket = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber, carSize: carSizeEnum.SMALL },
      });
    expectedSlotIdForSmallSize.push(resTicket.body.data.slotId);
  }

  for (const plateNumber of expectedPlateNumberForLargeSize) {
    const resTicket = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber, carSize: carSizeEnum.LARGE },
      });
    expectedSlotIdForLargeSize.push(resTicket.body.data.slotId);
  }
});

describe('GET /api/registration-plate-number', () => {
  test('small size - should return 200 with expected data', async () => {
    const response = await request(app)
      .get(`/api/registration-plate-number?parkingLotId=${parkingLotId}&carSize=${carSizeEnum.SMALL}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'success');
    expect(response.body.data.length).toEqual(expectedPlateNumberForSmallSize.length);
    expect(response.body.data).toEqual(expectedPlateNumberForSmallSize);
  });

  test('large size - should return 200 with expected data', async () => {
    const response = await request(app)
      .get(`/api/registration-plate-number?parkingLotId=${parkingLotId}&carSize=${carSizeEnum.LARGE}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'success');
    expect(response.body.data.length).toEqual(expectedPlateNumberForLargeSize.length);
    expect(response.body.data).toEqual(expectedPlateNumberForLargeSize);
  });
});

describe('GET /api/registration-allocated-slot', () => {
  test('small size - should return 200 with expected data', async () => {
    const response = await request(app)
      .get(`/api/registration-allocated-slot?parkingLotId=${parkingLotId}&carSize=${carSizeEnum.SMALL}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'success');
    expect(response.body.data.length).toEqual(expectedSlotIdForSmallSize.length);
    expect(response.body.data).toEqual(expectedSlotIdForSmallSize);
  });

  test('large size - should return 200 with expected data', async () => {
    const response = await request(app)
      .get(`/api/registration-allocated-slot?parkingLotId=${parkingLotId}&carSize=${carSizeEnum.LARGE}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'success');
    expect(response.body.data.length).toEqual(expectedSlotIdForLargeSize.length);
    expect(response.body.data).toEqual(expectedSlotIdForLargeSize);
  });
});
