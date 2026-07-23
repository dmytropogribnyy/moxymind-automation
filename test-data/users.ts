interface UserCredentials {
  username: string;
  password: string;
}

export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
} as const satisfies Record<'standard' | 'lockedOut', UserCredentials>;
