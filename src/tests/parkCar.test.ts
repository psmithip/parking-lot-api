import request from 'supertest';
import { app } from '../app';
import { dbConn } from '../database';
import { carSizeEnum } from '../enums/carSizeEnum';
import { clearDataInTestTable } from '../utils/database';

let parkingLotId: number;
const ticketTable = 'ticket';
const slotTable = 'slot';

describe('POST /api/park-car', () => {
  beforeAll(async () => {
    await clearDataInTestTable();

    const response = await request(app).post('/api/parking-lot').send({
      name: 'parking1',
      totalSlots: 3,
    });
    parkingLotId = response.body.data.parkingLotId;
  });

  test('should return 200 with ticket information', async () => {
    const plateNumber = 'ABC-1234';
    const resTicket = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber, carSize: carSizeEnum.MEDIUM },
      })
      .expect(200);
    expect(resTicket.body).toHaveProperty('message', 'success');
    expect(resTicket.body.data).toHaveProperty('id');
    expect(resTicket.body.data).toHaveProperty('entryAt');
    expect(resTicket.body.data).toHaveProperty('slotId');
    expect(resTicket.body.data).toHaveProperty('plateNumber', plateNumber);
    expect(resTicket.body.data).toHaveProperty('carSize', carSizeEnum.MEDIUM);

    await request(app).post('/api/leave-slot').send({ ticketId: resTicket.body.data.id });
  });

  test('should return 200 with nearest slot', async () => {
    // park car (ABC-111)
    const resTicket1 = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber: 'ABC-111', carSize: carSizeEnum.MEDIUM },
      })
      .expect(200);
    const ticketId1 = resTicket1.body.data.id;

    // car (ABC-111) should park in 1st nearest slot
    const slotInfo1 = await dbConn
      .table(ticketTable)
      .join(slotTable, `${slotTable}.id`, `${ticketTable}.slotId`)
      .where(`${ticketTable}.id`, ticketId1)
      .first();
    expect(slotInfo1.position).toEqual(1);

    // park car (ABC-222)
    const resTicket2 = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber: 'ABC-222', carSize: carSizeEnum.MEDIUM },
      })
      .expect(200);
    const ticketId2 = resTicket2.body.data.id;

    // car (ABC-222) should park in 2nd nearest slot
    const slotInfo2 = await dbConn
      .table(ticketTable)
      .join(slotTable, `${slotTable}.id`, `${ticketTable}.slotId`)
      .where(`${ticketTable}.id`, ticketId2)
      .first();
    expect(slotInfo2.position).toEqual(2);

    // park car (ABC-333)
    const resTicket3 = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber: 'ABC-333', carSize: carSizeEnum.MEDIUM },
      })
      .expect(200);
    const ticketId3 = resTicket3.body.data.id;

    // car (ABC-333) should park in 3rd nearest slot
    const slotInfo3 = await dbConn
      .table(ticketTable)
      .join(slotTable, `${slotTable}.id`, `${ticketTable}.slotId`)
      .where(`${ticketTable}.id`, ticketId3)
      .first();
    expect(slotInfo3.position).toEqual(3);

    // car (ABC-222) leave slot
    await request(app).post('/api/leave-slot').send({ ticketId: ticketId2 });

    // park car (ABC-444)
    const resTicket4 = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber: 'ABC-444', carSize: carSizeEnum.MEDIUM },
      })
      .expect(200);
    const ticketId4 = resTicket4.body.data.id;

    // car (ABC-444) should park in 2nd nearest slot
    const slotInfo4 = await dbConn
      .table(ticketTable)
      .join(slotTable, `${slotTable}.id`, `${ticketTable}.slotId`)
      .where(`${ticketTable}.id`, ticketId4)
      .first();
    expect(slotInfo4.position).toEqual(2);
  });

  test('should return 404 if cannot find available slot', async () => {
    const plateNumber = 'ABC-555';
    const carSize = carSizeEnum.MEDIUM;
    const response = await request(app)
      .post('/api/park-car')
      .send({
        parkingLotId,
        carInfo: { plateNumber, carSize },
      })
      .expect(404);
    expect(response.body).toHaveProperty(
      'message',
      `cannot find available slot | parkingLotId: ${parkingLotId}, plateNumber: ${plateNumber}, carSize: ${carSize}`
    );
  });
});
