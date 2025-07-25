import _ from 'lodash';
import { LoggerOptions, pino } from 'pino';

import { createAppConfig } from '@api/modules/config';

export const createLogger = _.once(() => {
  const appConfig = createAppConfig();

  const loggerOptions: LoggerOptions = {
    errorKey: 'error',
    messageKey: 'message',
    level: appConfig.log.level,
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  return pino(loggerOptions);
});
