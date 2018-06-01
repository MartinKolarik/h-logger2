# h-logger2

A human-friendly logger.

## Installation

```
$ npm install h-logger2
```

## Usage

```js
const Logger = require('h-logger2');
const logger = new Logger('my-app-name', [ new Logger.ConsoleWriter('trace') ]);

// available methods: trace, debug, info, warn, error, fatal
logger.trace('message', { foo: 123 }, { bar: 456 });
```


## License
Copyright (c) 2018 Martin Kolárik. Released under the MIT license.
