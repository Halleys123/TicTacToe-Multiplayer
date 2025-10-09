import dotenv from 'dotenv';

dotenv.config({
  path: `.env`,
  quiet: true,
});

if (process.env.NODE_ENV) {
  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
    quiet: true,
  });
}
