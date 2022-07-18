import express from 'express';
import userRouter from './routes/userRoutes.js';
import InternalError from './model/errorModel.js';
import errorController from './controllers/errorController.js';

export default function createExpressApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/v1/users', userRouter);

  app.all('*', (req, res, next) => next(new InternalError(`Page not found ${req.originalUrl}`, 404)));

  app.use(errorController);
  return app;
}
