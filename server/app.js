import express from 'express';
import userRouter from './routes/userRoutes.js';
import ServerError from './model/errorModel.js';
import errorController from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';

export default function createExpressApp() {
  const app = express();

  app.use(cors());

  const whitelist = ['http://localhost:3000', 'http://localhost:8080'];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
  app.options('*', cors(corsOptions));

  app.use(helmet());

  const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });
  app.use('/api', limiter);

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.use(mongoSanitize());
  app.use(xss());

  app.use(compression());

  app.use('/api/v1/users', userRouter);

  app.all('*', (req, res, next) => next(new ServerError(`Page not found ${req.originalUrl}`, 404)));

  app.use(errorController);
  return app;
}
