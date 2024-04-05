import { TestApp } from '../../tests/test-app.js';

describe('Smoke test', () => {
  let app = new TestApp();

  beforeEach(async () => {
    await app.setup();
  });

  afterEach(async () => {
    await app.teardown();
  });

  it('should run the app', async () => {
    const result = await app.request((req) => {
      return req.get('/');
    });

    expect(result.status).toBe(200);
  });
});
