import {Dopelista} from './application';
import {ApplicationConfig} from '@loopback/core';

export {Dopelista};

export async function main(options: ApplicationConfig = {}) {
  const app = new Dopelista(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Explorer on ${url}/explorer`);

  return app;
}
