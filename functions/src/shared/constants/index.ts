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
  JWT = 'JWT is invalid',
  TOKEN = 'Token is invalid',
  BAD_DATA = 'Data is incorrect',
  NOT_EXIST = 'API does not exist'
}

export enum COLLECTIONS {
  USERS = 'users',
  ADMIN = 'admin',
  ADS = 'ads',
  PRODUCTS = 'products',
  CONTACTS = 'contacts',
  SUBSCRIBERS = 'subscribers',
  BOOKINGS = 'bookings',
  PREBOOKINGS = 'pre-bookings'
}

export enum ENV {
  LOCAL = 'LOCAL',
  STAGE = 'STAGE',
  PROD = 'PROD'
}

export enum ENV_KEYS {
  SALT_ROUNDS = 'SALT_ROUNDS',
  JWT_SECRET = 'JWT_SECRET',
  ENVIRONMENT = 'ENVIRONMENT',
  JWT_EXP = 'JWT_EXP',
  JWT_EXP_ADMIN = 'JWT_EXP_ADMIN',
  MAIL_USER = 'MAIL_USER',
  MAIL_PASS = 'MAIL_PASS',
  RESET_TOKEN_EXP = 'RESET_TOKEN_EXP',
  UI_URL = 'UI_URL'
}

export enum AD_TYPE {
  COUNTDOWN,
  FOOTER
}

export enum CONTACT_TYPE {
  MOBILE,
  VIBER,
  TELEGRAM
}

export const TRANSLATIONS = {
  en: {
    registerEmailSubject: 'Email confirmation for Tkachuk Massage Therapy',
    registerEmailTitle: 'Confirmation email',
    registerEmailMessage: 'Please follow the link below in order to confirm your email:',
    remindEmailSubject: 'Reset of password for Tkachuk Massage Therapy',
    remindEmailTitle: 'Password reset',
    remindEmailMessage: 'Please follow the link below in order to reset your password:',
    adEmailSubject: 'New offers from Tkachuk Massage Therapy!'
  },
  ua: {
    registerEmailSubject: 'Підтвердити електронну пошту для Tkachuk Massage Therapy',
    registerEmailTitle: 'Підтвердіть email',
    registerEmailMessage: 'Будь ласка, перейдіть за посиланням нижче, щоб підтвердити електронну пошту:',
    remindEmailSubject: 'Змінити пароль для Tkachuk Massage Therapy',
    remindEmailTitle: 'Зміна пароля',
    remindEmailMessage: 'Будь ласка, перейдіть за посиланням нижче для того, щоб змінити пароль:',
    adEmailSubject: 'Нові пропозиції від Tkachuk Massage Therapy'
  }
}
