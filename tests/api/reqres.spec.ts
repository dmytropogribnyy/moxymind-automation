import { test, expect } from '../../fixtures/test';
import { usersToCreate } from '../../test-data/createUsers';
import { recordApiTiming } from '../../utils/api-observability';

test.describe('ReqRes API contracts', () => {
  test(
    'GET /api/users returns a valid paginated contract',
    { tag: ['@api', '@smoke', '@critical'] },
    async ({ reqresClient }, testInfo) => {
      const result = await reqresClient.listUsers(2);
      await recordApiTiming(testInfo, 'GET /api/users?page=2', result.elapsedMs);

      expect(result.response.status()).toBe(200);
      expect(result.response.headers()['content-type']).toContain('application/json');
      expect(result.body.page).toBe(2);
      expect(result.body.data.length).toBeGreaterThan(0);
      expect(result.body.data.length).toBeLessThanOrEqual(result.body.per_page);

      const userIds = result.body.data.map((user) => user.id);
      expect(new Set(userIds).size).toBe(userIds.length);
    },
  );

  test(
    'GET /api/users/:id returns 404 for an unknown user',
    { tag: ['@api', '@regression'] },
    async ({ reqresClient }, testInfo) => {
      const result = await reqresClient.getUser(23);
      await recordApiTiming(testInfo, 'GET /api/users/23', result.elapsedMs);

      expect(result.response.status()).toBe(404);
      expect(result.response.headers()['content-type']).toContain('application/json');
      expect(result.body).toEqual({});
    },
  );

  for (const payload of usersToCreate) {
    test(
      `POST /api/users creates ${payload.name} with an echoed contract`,
      { tag: ['@api', '@regression'] },
      async ({ reqresClient }, testInfo) => {
        const result = await reqresClient.createUser(payload);
        await recordApiTiming(testInfo, `POST /api/users (${payload.name})`, result.elapsedMs);

        expect(result.response.status()).toBe(201);
        expect(result.response.headers()['content-type']).toContain('application/json');
        expect(result.body).toMatchObject(payload);

        const createdAt = Date.parse(result.body.createdAt);
        const now = Date.now();
        expect(createdAt).toBeGreaterThan(now - 5 * 60 * 1_000);
        expect(createdAt).toBeLessThanOrEqual(now + 30_000);
      },
    );
  }
});
