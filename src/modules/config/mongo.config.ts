import Joi from 'joi';
import _ from 'lodash';

export const createMongoConfig = _.once(() => ({
  url: process.env.MONGO_URL!,
}));

export type MongoConfig = ReturnType<typeof createMongoConfig>;

export const MongoConfigSchema = {
  MONGO_URL: Joi.string().required(),
};
