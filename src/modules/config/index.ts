import Joi from 'joi';

import { AppConfigSchema } from '@api/modules/config/app.config';
import { MongoConfigSchema } from '@api/modules/config/mongo.config';

export { AppConfig, createAppConfig } from '@api/modules/config/app.config';
export {
  MongoConfig,
  createMongoConfig,
} from '@api/modules/config/mongo.config';

const schema = {
  ...AppConfigSchema,
  ...MongoConfigSchema,
};

const { error, value } = Joi.object()
  .keys(schema)
  .unknown()
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`environment variable error: ${error.message}`);
}

process.env = value;
