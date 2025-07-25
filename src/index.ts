import express from 'express';
import mongoose from 'mongoose';
import promMid from 'express-prometheus-middleware';

import { createLogger } from '@api/modules/logger/logger.factory';
import { createAppConfig, createMongoConfig } from '@api/modules/config';

import { MenuModule } from '@api/modules/menu/menu.module';
import { errorHandler } from '@api/modules/common/middlewares/error.middleware';

mongoose.set('strictQuery', false);

(async () => {
  const logger = createLogger();

  const appConfig = createAppConfig();
  const mongoConfig = createMongoConfig();

  await mongoose.connect(mongoConfig.url);

  const app = express();

  app.use(
    promMid({
      metricsPath: '/metrics',
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    }),
  );

  app.use(express.json());

  MenuModule.register(app);

  app.use(errorHandler(logger));

  app.listen(appConfig.port, () =>
    logger.info(`server is running at ${appConfig.port}`),
  );
})();
