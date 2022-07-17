import dotenv from 'dotenv';
import createExpressApp from './app.js';

dotenv.config({ path: './main.env' });

const app = createExpressApp();

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
