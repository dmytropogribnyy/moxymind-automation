interface UserCredentials {
  username: string;
  password: string;
}

export const users: Record<string, UserCredentials> = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};
