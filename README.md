# h-logger2

A human-friendly logger. Comes with pretty console output for both development and production environments,
and may be extended by implementing custom writers.

Additional writers:
 - [Elasticsearch and/or APM](https://github.com/MartinKolarik/h-logger2-elastic)

## Installation

```
$ npm install h-logger2
```

## Usage

```js
const Logger = require('h-logger2');

// ConsoleWriter is available directly in this module,
// other output/transfer methods may be implemented as separate modules
const logger = new Logger('my-app-name', [ new Logger.ConsoleWriter(Logger.TRACE) ]);

// simple text message
logger.trace('message');

// message with additional context object
logger.debug('message', { foo: 123 });

// message with associated error
logger.error('message', new Error('error'));

// message with associated error and additional context
logger.trace('message', new Error('error'), { foo: 123 });

// creates a new logger with name my-app-name:redis
const redisLogger = logger.scope('redis');
```

## API

### Logging

#### logger.trace(message[, error[, context]])
#### logger.debug(message[, error[, context]])
#### logger.info(message[, error[, context]])
#### logger.warn(message[, error[, context]])
#### logger.error(message[, error[, context]])
#### logger.fatal(message[, error[, context]])

### Other

#### logger.scope(name): Logger

## Custom writers

A writer is simply a class that implements the [Writer interface](src/Writer.ts). See the [ConsoleWriter](/src/ConsoleWriter.ts) implementation for an example.

## License
Copyright (c) 2018 Martin Kolárik. Released under the MIT license.
