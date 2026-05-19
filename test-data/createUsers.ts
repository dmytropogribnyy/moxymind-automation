export interface UserPayload {
  name: string;
  job: string;
}

export const usersToCreate: UserPayload[] = [
  { name: 'morpheus', job: 'leader' },
  { name: 'neo', job: 'engineer' },
  { name: 'trinity', job: 'operator' },
];
