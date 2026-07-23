import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ZodType } from 'zod';
import {
  createUserPayloadSchema,
  createUserResponseSchema,
  usersPageSchema,
} from '../schemas/reqres.schemas';
import type { CreateUserPayload, CreateUserResponse, UsersPage } from '../schemas/reqres.schemas';

export interface TimedApiResult<T> {
  response: APIResponse;
  body: T;
  elapsedMs: number;
}

export class ReqresClient {
  constructor(private readonly request: APIRequestContext) {}

  async listUsers(page = 2): Promise<TimedApiResult<UsersPage>> {
    return this.requestAndParse(
      () => this.request.get('/api/users', { params: { page } }),
      usersPageSchema,
      `GET /api/users?page=${page}`,
    );
  }

  async createUser(payload: CreateUserPayload): Promise<TimedApiResult<CreateUserResponse>> {
    const validPayload = createUserPayloadSchema.parse(payload);

    return this.requestAndParse(
      () => this.request.post('/api/users', { data: validPayload }),
      createUserResponseSchema,
      'POST /api/users',
    );
  }

  async getUser(userId: number): Promise<TimedApiResult<unknown>> {
    const startedAt = Date.now();
    const response = await this.request.get(`/api/users/${userId}`);
    const body: unknown = await response.json();

    return {
      response,
      body,
      elapsedMs: Date.now() - startedAt,
    };
  }

  private async requestAndParse<T>(
    requestAction: () => Promise<APIResponse>,
    schema: ZodType<T>,
    operation: string,
  ): Promise<TimedApiResult<T>> {
    const startedAt = Date.now();
    const response = await requestAction();
    const elapsedMs = Date.now() - startedAt;
    const rawBody: unknown = await response.json();
    const parsed = schema.safeParse(rawBody);

    if (!parsed.success) {
      throw new Error(`${operation} contract validation failed: ${parsed.error.message}`);
    }

    return {
      response,
      body: parsed.data,
      elapsedMs,
    };
  }
}
