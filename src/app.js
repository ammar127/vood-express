import 'dotenv/config';

import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import compression from 'compression';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';

import * as configs from './config';
import { authenticationMiddleware } from './middleware';

const { NODE_ENV } = process.env;

const app = express();

if (NODE_ENV !== 'development') {
  // configuration

  // handlers
}

// Required middleware list
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(configs.corsConfig));
app.use(compression(configs.compressionConfig));
app.use(cookieParser());

// Custom middleware list
app.use(authenticationMiddleware);
// if (NODE_ENV !== 'development') {
// }

// Load router paths
configs.routerConfig(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// if (NODE_ENV !== 'development') {
// }

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err);
});

export default app;
