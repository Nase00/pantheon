/* eslint no-console:0, import/prefer-default-export:0 */
import winston from 'winston';
import moment from 'moment';
import colors from 'colors';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: 'events.log',
      timestamp: false,
      maxsize: 100000000
    })
  ]
});

const getTime = () => moment().format('M/D/YY hh:mm:ss A');
const withTime = (message) => `${colors.grey(getTime())} | ${message}`;

export const logActionType = (type) => {
  logger.log('info', withTime(colors.yellow(type)));
};

export const logUndefinedHandler = (e) => {
  logger.log('error', withTime(colors.red(e.message)));
};

export const errorNoHandler = (event) => {
  const message = `${colors.red('Unhandled event')}: ${event}`;

  logger.log('error', withTime(message));
};

export const errorLightStatus = () => {
  const message = `${colors.red('Could not alter light state')}; did you use the correct IP address?`;

  logger.log('error', withTime(message));
};
