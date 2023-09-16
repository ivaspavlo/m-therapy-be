export const CORS_URLS: string[] = [];

export enum ERROR_MESSAGES {
  GENERAL = 'Internal server error',
  DUPLICATE = 'Instance already exists',
  NOT_FOUND = 'Instance not found',
  CREDENTIALS = 'Credentials are incorrect',
  FIELDS_VALIDATION = 'Validation for fields failed'
};

export enum COLLECTIONS {
  USERS = 'users',
  ADMIN = 'admin'
}

export enum ENV_KEYS {
  SALT_ROUNDS = 'SALT_ROUNDS',
  JWT_SECRET = 'JWT_SECRET',
  ENVIRONMENT = 'ENVIRONMENT',
  JWT_EXP = 'JWT_EXP',
  MAIL_USER = 'MAIL_USER',
  MAIL_PASS = 'MAIL_PASS',
  RESET_TOKEN_EXP = 'RESET_TOKEN_EXP',
  UI_URL = 'UI_URL'
}
