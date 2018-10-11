# EchoAtTime

A simple application server that prints a message at a given time in the future.
Uses Redis to persist messages in case of failure.

## Installation

### Prerequisites

To run the app you will need Node.js (8.12.0 or newer) and Redis (4.0.11 or newer)

```bash
$ npm install
```

## OPTIONAL: configure the app

The app can be configured through the files in the `config` folder (see https://www.npmjs.com/package/config)

If you are going to run multiple instances of the app simultaneously and connect them to a single Redis instance/cluster, you should specify unique names for the 'In Progress' set in Redis for each server in the config: `config.redis.inProgressSet`. That way each instance of the app will work on its own 'In Progress' set.

## Run the app

```bash
$ npm start
```

## Test the app:

- `npm run test:unit` - will run unit tests.
- `npm run test:acceptance` - will run acceptance tests.

NOTE: the acceptance test suite requires a running app server and a Redis server.

## API documentation

#### POST http://localhost:3000/api/v1/echo

Schedules a message to be printed out in console on a specific time in the future.

- Request body params (JSON):

  - `time` (REQUIRED) - `Number`

  Time when the message should be printed represented by the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC. Should be greater than current time but not more than a year from now.

  - `message` (REQUIRED) - `String`

  A string to print in the console. Should not be empty.

- Responses:
  - 202 Accepted
  - 400 Bad Request (also contains an array of errors in the response body)

### Note: possible improvements

- Use Redis SortedSets instead of Sets?
- Integration tests for the Redis client
