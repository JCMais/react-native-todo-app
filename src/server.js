// @flow
import 'babel-polyfill';
import 'isomorphic-fetch';
import 'source-map-support/register'

import Koa from 'koa';
import cors from 'koa-cors';
import graphqlHTTP from 'koa-graphql';
import convert from 'koa-convert';
import logger from 'koa-logger';

import connectDatabase from './database';
import { schema } from './schema';
import { jwtSecret } from './config';
import { getUser } from './auth';
import { graphqlPort } from './config';

const app = new Koa();

app.keys = jwtSecret;

app.use(logger());
app.use(convert(cors()));
app.use(convert(graphqlHTTP(async (req) => {
    const { user } = await getUser(req.header.authorization);

    return {
        graphiql: process.env.NODE_ENV !== 'production',
        schema,
        context: {
            user,
        },
        formatError: (error) => {
            console.log(error.message);
            console.log(error.locations);
            console.log(error.stack);

            return {
                message: error.message,
                locations: error.locations,
                stack: error.stack,
            };
        },
    };
})));

(async () => {
  try {
    const info = await connectDatabase();
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit(1);
  }

  await app.listen(graphqlPort);
  console.log(`Server started on port ${graphqlPort}`);
})();
