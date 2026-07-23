import type { CreateUserPayload } from '../schemas/reqres.schemas';

export const usersToCreate = [
  { name: 'morpheus', job: 'leader' },
  { name: 'neo', job: 'engineer' },
  { name: 'trinity', job: 'operator' },
] as const satisfies readonly CreateUserPayload[];
