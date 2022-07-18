import mongoose from 'mongoose';
import dotenv from 'dotenv';
import createExpressApp from './app.js';

dotenv.config({ path: process.env.NODE_ENV === 'prod' ? './env/prod.env' : './env/dev.env' });

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
    });

    createExpressApp().listen(process.env.PORT, () => {
      console.log(`Listening on ${process.env.PORT}`);
    });
  } catch (e) {
    console.error('Something went wrong on server initialization', e.name, e.message);
  }
}

main();
