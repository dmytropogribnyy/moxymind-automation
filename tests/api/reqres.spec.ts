// Note: comments are included for demo/interview purposes
// In a real project, well-named tests are usually self-documenting
import { test, expect } from '@playwright/test';
import { usersToCreate } from '../../test-data/createUsers';

const RESPONSE_TIME_LIMIT_MS = 2000;

test.describe('ReqRes API', { tag: '@api' }, () => {
  test('GET /api/users?page=2 — should return paginated user list', async ({
    request,
  }) => {
    /**
     * Validates that the core user listing endpoint works correctly.
     * Pagination, data shape, and total count are critical for any client
     * consuming this API. A broken GET endpoint = no users displayed anywhere.
     */
    const start = Date.now();
    const response = await request.get('/api/users?page=2');
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(RESPONSE_TIME_LIMIT_MS);

    const body = await response.json();

    expect(body).toMatchObject({
      page: expect.any(Number),
      per_page: expect.any(Number),
      total: expect.any(Number),
      total_pages: expect.any(Number),
      data: expect.any(Array),
    });

    expect(body.total).toBe(12);
    expect(body.data[0].last_name).toBe('Lawson');
    expect(body.data[1].last_name).toBe('Ferguson');

    expect(body.data.length).toBe(body.per_page);
    expect(body.data.length).toBeLessThanOrEqual(body.total);

    for (const user of body.data) {
      expect(user).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        avatar: expect.any(String),
      });
    }

    if (body.support) {
      expect(body.support).toMatchObject({
        url: expect.any(String),
        text: expect.any(String),
      });
    }
  });

  // Loop outside test() so each user generates a separate named test case in the report.
  // This makes failures immediately visible per user, not hidden inside a single test.
  for (const user of usersToCreate) {
    test(`POST /api/users — should create user "${user.name}" (${user.job})`, async ({
      request,
    }) => {
      /**
       * Validates that the user creation endpoint works correctly for
       * multiple different payloads. Data-driven approach ensures the endpoint
       * handles various inputs consistently. A broken POST = no new users
       * can be created, blocking all registration flows.
       */
      const start = Date.now();
      const response = await request.post('/api/users', {
        data: { name: user.name, job: user.job },
      });
      const elapsed = Date.now() - start;

      expect(response.status()).toBe(201);
      expect(elapsed).toBeLessThan(RESPONSE_TIME_LIMIT_MS);

      const body = await response.json();

      expect(body).toMatchObject({
        name: user.name,
        job: user.job,
        id: expect.any(String),
        createdAt: expect.any(String),
      });

      expect(body.id.length).toBeGreaterThan(0);
      expect(new Date(body.createdAt).getTime()).not.toBeNaN();
    });
  }
});
