const _ = require('lodash');
const PrettyError = require('pretty-error');
const format = require('date-format');
const chalk = require('chalk');
const util = require('util');
const ms = require('ms');

const Writer = require('./Writer');
const hostname = require('os').hostname();
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
	constructor (level, options) {
		super(level, options);
		this.diff = new Date();
		this.inspectOptions = { breakLength: 80, depth: null, maxArrayLength: null };
	}

	inspect (object) {
		return '  ' + util.inspect(object, this.inspectOptions).replace(/\n(.)/g, '\n  $1');
	}

	write (logger, level, message, error, context) {
		let color = ConsoleWriter.colors[level];
		let date = new Date();

		console.log(
			chalk.gray(`${process.pid}@${hostname}`), '',
			chalk.green(logger.name), '',
			format('yyyy-MM-dd hh:mm:ss', date), '',
			chalk[color](`${logger.constructor.levelsByValue[level]}:`), chalk[color](message) + (level > logger.constructor.levels.debug ? '' : ` +${ms(date - this.diff)}`),
		);

		if (error) {
			if (error instanceof Error) {
				if (chalk.supportsColor) {
					console.log(pe.render(error));

					// Some errors have additional properties that might be useful.
					let obj = _.omit(error, [ 'name' ]);

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

ConsoleWriter.colors = {
	60: 'red',
	50: 'redBright',
	40: 'yellowBright',
	30: 'cyanBright',
	20: 'blueBright',
	10: 'magenta',
};

module.exports = ConsoleWriter;
