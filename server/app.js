import express from 'express';

export default function createExpressApp() {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({ status: 'get ok' });
  });

  app.post('/', (req, res) => {
    res.status(200).json({ status: 'post ok' });
  });

  return app;
}
