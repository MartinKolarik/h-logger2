import Logger = require('./index.js');

export type LogLevelName = keyof typeof Logger.levels;
export type LogLevelValue = keyof typeof Logger.levelsByValue;
