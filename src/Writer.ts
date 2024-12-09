import Logger, { LogLevelValue } from './Logger.js';

abstract class Writer {
	level: LogLevelValue;
	options: object;

	protected constructor (level: LogLevelValue, options: object = {}) {
		this.level = level;
		this.options = options;
	}

	abstract write (logger: Logger, level: LogLevelValue, message: string, error: Error | null, context: unknown): void;
}

export default Writer;
