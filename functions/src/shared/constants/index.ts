export const CORS_URLS: string[] = [];

export enum FE_URLS {
  CONFIRM_REGISTER = 'auth/register-confirm',
  RESET_PASSWORD = 'auth/reset'
}

export enum ERROR_MESSAGES {
  GENERAL = 'Internal server error',
  DUPLICATE = 'Instance already exists',
  NOT_FOUND = 'Instance not found',
  CREDENTIALS = 'Credentials are incorrect',
  FIELDS_VALIDATION = 'Validation for fields failed',
  JWT = 'JWT is invalid'
}

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

export const TRANSLATIONS = {
  en: {
    registerEmailSubject: 'Email confirmation for Tkachuk Massage Therapy',
    registerEmailTitle: 'Confirm email',
    registerEmailMessage: 'Please follow the link below in order to reset your password:',
    remindEmailSubject: 'Reset of password for Tkachuk Massage Therapy',
    remindEmailTitle: 'Password reset',
    remindEmailMessage: 'Please follow the link below in order to reset your password:'
  },
  ua: {
    registerEmailSubject: 'Підтвердити електронну пошту для Tkachuk Massage Therapy',
    registerEmailTitle: 'Підтвердіть email',
    registerEmailMessage: 'Будь ласка, перейдіть за посиланням нижче, щоб підтвердити електронну пошту:',
    remindEmailSubject: 'Змінити пароль для Tkachuk Massage Therapy',
    remindEmailTitle: 'Зміна пароля',
    remindEmailMessage: 'Будь ласка, перейдіть за посиланням нижче для того, щоб змінити пароль:'
  }
}
