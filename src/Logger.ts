import Writer from './Writer.js';

class Logger {
	name: string;
	writers: Writer[];

	constructor (name: string, writers: Writer[] = []) {
		this.name = name;
		this.writers = writers;
	}

	debug (message: string, error: Error | null = null, context: any = null) {
		return this.log(Logger.levels.debug, message, error, context);
	}

	error (message: string, error: Error | null = null, context: any = null) {
		return this.log(Logger.levels.error, message, error, context);
	}

	fatal (message: string, error: Error | null = null, context: any = null) {
		return this.log(Logger.levels.fatal, message, error, context);
	}

	info (message: string, error: Error | null = null, context: any = null) {
		return this.log(Logger.levels.info, message, error, context);
	}

	log (level: LogLevelValue, message: string, error: Error | null = null, context: any = null) {
		if (typeof message !== 'string') {
			throw new TypeError('The "message" argument must be a string.');
		}

		if (context === null && !(error instanceof Error)) {
			context = error;
			error = null;
		}

		this.writers.forEach((writer) => {
			if (level >= writer.level) {
				writer.write(this, level, message, error, context);
			}
		});

		return this;
	}

	trace (message: string, error: Error | null = null, context: any = null) {
		return this.log(Logger.levels.trace, message, error, context);
	}

	scope (name: string): Logger {
		return new Logger(`${this.name}:${name}`, this.writers);
	}

	serialize (object: any, serializers = Logger.serializers): any {
		const result: any = {};

		if (!object) {
			return result;
		}

		Object.keys(object).concat(Object.keys(serializers)).forEach((key) => {
			let value = object[key];

			if (value && Object.hasOwn(serializers, key)) {
				value = serializers[key].call(serializers, value);
			}

			if (value !== undefined) {
				result[key] = value;
			}
		});

		return result;
	}

	warn (message: string, error: Error | null = null, context: any = null) {
		return this.log(Logger.levels.warn, message, error, context);
	}

	static levels = {
		fatal: 60,
		error: 50,
		warn: 40,
		info: 30,
		debug: 20,
		trace: 10,
	} as const;

	public static levelsByValue = {
		60: 'FATAL',
		50: 'ERROR',
		40: 'WARN',
		30: 'INFO',
		20: 'DEBUG',
		10: 'TRACE',
	} as const;

	static serializers: { [key: string]: (input: any) => any } = {
		ctx (ctx) {
			return {
				req: this.req(ctx.req),
				res: {
					status: ctx.response.statusCode,
					headers: ctx.response.headers,
				},
			};
		},
		options (options) {
			return {
				method: options.method,
				url: options.url.href,
				headers: options.headers,
			};
		},
		req (req) {
			if (!req.method) {
				return;
			}

			return {
				method: req.method,
				url: req.originalUrl || req.url,
				headers: req.headers,
				remoteAddress: req.connection?.remoteAddress,
				remotePort: req.connection?.remotePort,
			};
		},
		request (req) {
			return this.req(req);
		},
		res (res) {
			return {
				status: res.statusCode,
				message: res.statusMessage,
				headers: res.headers,
				body: res.body,
			};
		},
		response (res) {
			return this.res(res);
		},
		timings (timings) {
			return timings.phases;
		},
	};
}

export default Logger;
export type LogLevelName = typeof Logger.levels;
export type LogLevelValue = keyof typeof Logger.levelsByValue;
