export const CORS_URLS: string[] = [];

export enum ERROR_MESSAGES {
  GENERAL = 'Internal server error',
  DUPLICATE = 'Instance already exists',
  FIELDS_VALIDATION = 'Validation for fields failed'
};

export enum COLLECTIONS {
  USERS = 'users'
}

export enum ENV_KEYS {
  SALT_ROUNDS = 'SALT_ROUNDS'
}
