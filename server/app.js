/* eslint-disable */
import 'regenerator-runtime/runtime';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { graphql } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import schema from './schema/schema';

// constants needed
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 1338 : process.env.PORT;
const app = express();
const graphqlHTTP = require('express-graphql');
const query = 'query { employees { id, employees, location }}';

app.use(express.static(__dirname + '/public'));

graphql(schema, query).then((result) => {
  console.log(JSON.stringify(result))
});

(async () => {
  app.use('/api', graphqlHTTP({ schema, pretty: true, graphiql: true }))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  app.listen(port, '0.0.0.0', (err) => {
    if (err) {
      return console.warn(err);
    }
    return console.info(`==> 😎 Listening on port ${port}. Open http://0.0.0.0:${port}/ in your browser.`);
  });

  let json = await graphql(schema, introspectionQuery);
  fs.writeFile(
    './server/schema/schema.json',
    JSON.stringify(json, null, 2),
    err => {
      if (err) throw err;
      console.log("JSON Schema Created")
    });
})();
/* eslint-enable */
