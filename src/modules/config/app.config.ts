import Joi from 'joi';
import _ from 'lodash';

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export const createAppConfig = _.once(() => ({
  port: +process.env.PORT!,
  log: {
    level: process.env.LOG_LEVEL as unknown as LogLevel,
  },
}));

export type AppConfig = ReturnType<typeof createAppConfig>;

export const AppConfigSchema = {
  PORT: Joi.number().default(8000),
  LOG_LEVEL: Joi.string()
    .valid('trace', 'debug', 'info', 'warn', 'error')
    .default('info'),
};
