import util from 'node:util';
import os from 'node:os';
import _ from 'lodash';
import PrettyError from 'pretty-error';
import format from 'date-format';
import chalk from 'chalk';
import ms from 'ms';

import Logger, { LogLevelValue } from './Logger.js';
import Writer from './Writer.js';

const hostname = os.hostname();
const pe = new PrettyError();

pe.appendStyle({
	'pretty-error > header > title > kind': {
		background: 'none',
		color: 'bright-red',
	},
	'pretty-error > header > colon': {
		background: 'none',
		color: 'bright-red',
	},
	'pretty-error > header > message': {
		background: 'none',
		color: 'bright-red',
	},
	'pretty-error > trace > item': {
		marginBottom: 0,
	},
});

if (!chalk.supportsColor) {
	pe.withoutColors();
}

class ConsoleWriter extends Writer {
	private diff: Date;
	private inspectOptions: util.InspectOptions;

	static colors = {
		60: 'red',
		50: 'redBright',
		40: 'yellowBright',
		30: 'cyanBright',
		20: 'blueBright',
		10: 'magenta',
	} as const;

	constructor (level: LogLevelValue, options: object = {}) {
		super(level, options);
		this.diff = new Date();
		this.inspectOptions = { breakLength: 80, depth: null, maxArrayLength: null };
	}

	private inspect (object: any): string {
		return '  ' + util.inspect(object, this.inspectOptions).replace(/\n(.)/g, '\n  $1');
	}

	public write (logger: Logger, level: LogLevelValue, message: string, error?: any, context?: any): void {
		const cons = logger.constructor as unknown as typeof Logger;
		const color = ConsoleWriter.colors[level];
		const date = new Date();

		console.log(
			chalk.gray(`${process.pid}@${hostname}`), '',
			chalk.green(logger.name), '',
			format('yyyy-MM-dd hh:mm:ss', date), '',
			chalk[color](`${cons.levelsByValue[level].toUpperCase()}:`), chalk[color](message) + (level > cons.levels.debug ? '' : ` +${ms(date.getTime() - this.diff.getTime())}`),
		);

		if (error) {
			if (error instanceof Error) {
				if (chalk.supportsColor) {
					console.log(pe.render(error));

					// Some errors have additional properties that might be useful.
					const obj = _.omit(logger.serialize(error), [ 'name' ]);

					if (Object.keys(obj).length) {
						console.log(chalk[color](this.inspect(obj)));
					}
				} else {
					console.log(this.inspect(error));
				}
			} else {
				console.log(chalk[color](this.inspect(logger.serialize(error))));
			}
		}

		if (context) {
			console.log(this.inspect(logger.serialize(context)));
		}

		this.diff = date;
	}
}

export default ConsoleWriter;
