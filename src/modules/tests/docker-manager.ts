import * as path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';

export const startDocker = async () => {
  const composeFilePath = path.resolve(__dirname);
  const composeFile = 'docker-compose.yml';

  const environment: StartedDockerComposeEnvironment =
    await new DockerComposeEnvironment(composeFilePath, composeFile).up();

  globalThis.__DOCKER_INSTANCE__ = environment;
};

export const stopDocker = async () => {
  if (!globalThis.__DOCKER_INSTANCE__) {
    return;
  }

  try {
    await globalThis.__DOCKER_INSTANCE__.down();
    globalThis.__DOCKER_INSTANCE__ = null;
  } catch (e) {
    console.error('Failed to stop docker-compose', e);
  }
};
