import { startDocker, stopDocker } from './docker-manager.js';

export const setup = async () => {
  await startDocker();
};

export const teardown = async () => {
  await stopDocker();
};
