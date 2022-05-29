import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// fastify
import fastify from 'fastify';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyFormBody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';
import fastifyHealthCheck from 'fastify-healthcheck';

// routes
import compare from './routes/compare/post.mjs';
import lessonTables from './routes/lesson/tables/post.mjs';

const server = fastify({ logger: true });

// plugins
server.register(fastifyHealthCheck, { exposeUptime: true });
server.register(helmet, { global: true });
server.register(fastifyCompress, { global: true, inflateIfDeflated: true });
server.register(fastifyCookie);
server.register(fastifySession, {
  secret: 'a secret with minimum length of 32 characters',
  cookie: {
    secure: false
  }
});
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});
server.register(fastifyFormBody);
server.register(fastifyMultipart, {
  attachFieldsToBody: true,
});

// routes
server.post('/compare/', {
  prefixTrailingSlash: 'both'
}, compare);

server.post('/lesson/tables', {
  prefixTrailingSlash: 'both'
}, lessonTables);

// server start
const start = async () => {
  try {
    await server.listen({ port: 3000, host: '127.0.0.1' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export { server, start};