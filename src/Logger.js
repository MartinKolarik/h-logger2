class Logger {
	constructor (name, writers = []) {
		this.name = name;
		this.writers = writers;
	}

	debug (message, error = null, context = null) {
		return this.log(Logger.levels.debug, message, error, context);
	}

	error (message, error = null, context = null) {
		return this.log(Logger.levels.error, message, error, context);
	}

	fatal (message, error = null, context = null) {
		return this.log(Logger.levels.fatal, message, error, context);
	}

	info (message, error = null, context = null) {
		return this.log(Logger.levels.info, message, error, context);
	}

	log (level, message, error = null, context = null) {
		if (message && typeof message === 'object') {
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

	trace (message, error = null, context = null) {
		return this.log(Logger.levels.trace, message, error, context);
	}

	scope (name) {
		return new Logger(`${this.name}:${name}`, this.writers);
	}

	serialize (object, serializers = Logger.serializers) {
		let result = {};

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

	warn (message, error = null, context = null) {
		return this.log(Logger.levels.warn, message, error, context);
	}
}

Logger.levels = {
	fatal: 60,
	error: 50,
	warn: 40,
	info: 30,
	debug: 20,
	trace: 10,
};

Logger.levelsByValue = {
	60: 'FATAL',
	50: 'ERROR',
	40: 'WARN',
	30: 'INFO',
	20: 'DEBUG',
	10: 'TRACE',
};

Logger.serializers = {
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

module.exports = Logger;
