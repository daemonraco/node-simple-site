'use strict';

const path = require('path');
const util = require('util');
const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

const customFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logsPath = path.join(__dirname, '../logs');
const date = new Date();
const datestr = `.${date.getFullYear()}${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        customFormat,
    ),
    transports: [],
});

if (global.env.logs.levels.console) {
    logger.add(new transports.Console({
        format: format.simple(),
        level: 'silly',
    }));
}

if (global.env.logs.levels.debug) {
    logger.add(new transports.File({
        filename: `${logsPath}/debug${datestr}.log`,
        level: 'debug',
    }));
}

if (global.env.logs.levels.error) {
    logger.add(new transports.File({
        filename: `${logsPath}/error${datestr}.log`,
        level: 'error',
    }));
}

if (global.env.logs.levels.info) {
    logger.add(new transports.File({
        filename: `${logsPath}/info${datestr}.log`,
        level: 'info',
    }));
}

console.log = (fmt, ...args) => {
    for (const piece of util.format(fmt, ...args).split('\n')) {
        logger.info(piece);
    }
    process.stdout.write(util.format(fmt, ...args) + '\n');
};
console.error = (fmt, ...args) => {
    for (const piece of util.format(fmt, ...args).split('\n')) {
        logger.error(piece);
    }
    process.stderr.write(util.format(fmt, ...args) + '\n');
};

module.exports = logger;
