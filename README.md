# parking-lot-api

## Requirement
```
- Docker
- Docker Compose
```

## Getting started
```
# Copy .env from .env.example, then change details if needed
cp .env.example .env

# Start docker
docker-compose up -d
```

## Run Test
```
# access into app container 
docker-compose exec app sh

# run command for testing
npm run test
```

## API Endpoint

### POST /api/parking-lot
    api to create parking lot
### POST /api/park-car
    api to park the car
### POST /api/leave-slot
    api to leave the slot
### GET /api/parking-lot-status/1
    api to get status of parking lot
### GET /api/registration-plate-number?parkingLotId=1&carSize=SMALL
    api to get registration plate number list by car size
### GET /api/registration-allocated-slot?parkingLotId=1&carSize=SMALL
    api to get registration allocated slot number list by car size
