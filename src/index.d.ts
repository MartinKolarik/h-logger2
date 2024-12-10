declare type LogLevelName = keyof typeof Logger.levels;
declare type LogLevelValue = keyof typeof Logger.levelsByValue;

declare class Writer {
	constructor (level: LogLevelValue, options?: object);

	level: LogLevelValue;
	options: object;

	write (logger: Logger, level: LogLevelValue, message: string, error?: any, context?: any): void;
}

declare class ConsoleWriter extends Writer {
	constructor (level: LogLevelValue, options?: object);

	static colors: Record<LogLevelValue, string>;

	write (logger: Logger, level: LogLevelValue, message: string, error?: any, context?: any): void;

	protected inspect (object: any): string;
}

declare class Logger {
	constructor (name: string, writers?: Writer[]);

	name: string;
	writers: Writer[];

	trace (message: string, error?: any | null, context?: any | null): this;
	debug (message: string, error?: any | null, context?: any | null): this;
	info (message: string, error?: any | null, context?: any | null): this;
	warn (message: string, error?: any | null, context?: any | null): this;
	error (message: string, error?: any | null, context?: any | null): this;
	fatal (message: string, error?: any | null, context?: any | null): this;

	log (level: LogLevelValue, message: string, error?: any | null, context?: any | null): this;

	scope (name: string): Logger;

	serialize (
		object: Record<string, any>,
		serializers?: Record<string, (value: any) => any>,
	): Record<string, any>;


	static levels: {
		fatal: 60,
		error: 50,
		warn: 40,
		info: 30,
		debug: 20,
		trace: 10,
	};

	static levelsByValue: {
		60: 'FATAL',
		50: 'ERROR',
		40: 'WARN',
		30: 'INFO',
		20: 'DEBUG',
		10: 'TRACE',
	};

	static serializers: Record<string, (value: any) => any>;
}

declare namespace LoggerNamespace {
	export { Logger, LogLevelName, LogLevelValue, ConsoleWriter, Writer };
}

declare const LoggerDefaultExport: typeof Logger & typeof LoggerNamespace;
export = LoggerDefaultExport;
