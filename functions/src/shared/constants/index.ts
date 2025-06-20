export const CORS_URLS: string[] = [];

export enum FE_URLS {
  CONFIRM_REGISTER = 'auth/register-confirm',
  RESET_PASSWORD = 'auth/reset'
}

export enum RESPONSE_STATUS {
  GENERAL = 'GENERAL',
  DUPLICATE = 'DUPLICATE',
  NOT_FOUND = 'NOT_FOUND',
  CREDENTIALS = 'CREDENTIALS',
  FIELDS_VALIDATION = 'FIELDS_VALIDATION',
  JWT = 'JWT',
  TOKEN = 'TOKEN',
  BAD_DATA = 'BAD_DATA',
  NOT_EXIST = 'NOT_EXIST'
}

export const ERROR_MESSAGES = {
  [RESPONSE_STATUS.GENERAL]: 'Internal server error',
  [RESPONSE_STATUS.DUPLICATE]: 'Instance already exists',
  [RESPONSE_STATUS.NOT_FOUND]: 'Instance not found',
  [RESPONSE_STATUS.CREDENTIALS]: 'Credentials are incorrect',
  [RESPONSE_STATUS.FIELDS_VALIDATION]: 'Validation for fields failed',
  [RESPONSE_STATUS.JWT]: 'JWT is invalid',
  [RESPONSE_STATUS.TOKEN]: 'Token is invalid',
  [RESPONSE_STATUS.BAD_DATA]: 'Data is incorrect',
  [RESPONSE_STATUS.NOT_EXIST]: 'API does not exist',
};

export enum COLLECTIONS {
  USERS = 'users',
  ADMIN = 'admin',
  ADS = 'ads',
  PRODUCTS = 'products',
  CONTACTS = 'contacts',
  PAYMENT_CARDS = 'payment-cards',
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
  ENVIRONMENT = 'ENVIRONMENT',
  JWT_EXP = 'JWT_EXP',
  JWT_EXP_ADMIN = 'JWT_EXP_ADMIN',
  RESET_TOKEN_EXP = 'RESET_TOKEN_EXP',
  UI_URL = 'UI_URL',
  UI_URL_LOCAL = 'UI_URL_LOCAL',
  FIREBASE_SERVICE_ACCOUNT_STAGE = 'FIREBASE_SERVICE_ACCOUNT_STAGE'
}

export enum ENV_SECRETS {
  JWT_SECRET = 'JWT_SECRET',
  MAIL_USER = 'MAIL_USER',
  MAIL_PASS = 'MAIL_PASS'
}

export const ENV_KEYS_ = {
  general: {
    ENVIRONMENT: 'ENVIRONMENT',
    ui_url: 'ui_url'
  },
  AUTH: {
    SALT_ROUNDS: 'SALT_ROUNDS',
    JWT_SECRET: 'JWT_SECRET',
    JWT_EXP: 'JWT_EXP',
    JWT_EXP_ADMIN: 'JWT_EXP_ADMIN',
    RESET_TOKEN_EXP: 'RESET_TOKEN_EXP'
  },
  MAIL: {
    MAIL_USER: 'MAIL_USER',
    MAIL_PASS: 'MAIL_PASS',
  }
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
    registerEmailSubject: 'Email confirmation on Tkachuk Massage Therapy',
    registerEmailTitle: 'Confirmation email',
    registerEmailMessage: 'Please follow the link below in order to confirm your email:',
    remindEmailSubject: 'Reset of password on Tkachuk Massage Therapy',
    remindEmailTitle: 'Password reset',
    remindEmailMessage: 'Please follow the link below in order to reset your password:',
    adEmailSubject: 'New offers from Tkachuk Massage Therapy!',
    confirmBookingSubject: 'Massage booking confirmation on Tkachuk Massage Therapy',
    confirmBookingTitle: 'Massage booking confirmation',
    confirmBookingMessage: 'Please follow the link below to confirm your booking'
  },
  ua: {
    registerEmailSubject: 'Підтвердити електронну пошту для Tkachuk Massage Therapy',
    registerEmailTitle: 'Підтвердіть email',
    registerEmailMessage: 'Будь ласка, перейдіть за посиланням нижче, щоб підтвердити електронну пошту:',
    remindEmailSubject: 'Змінити пароль для Tkachuk Massage Therapy',
    remindEmailTitle: 'Зміна пароля',
    remindEmailMessage: 'Будь ласка, перейдіть за посиланням нижче для того, щоб змінити пароль:',
    adEmailSubject: 'Нові пропозиції від Tkachuk Massage Therapy',
    confirmBookingSubject: 'Підтвердження резервування массажу на Tkachuk Massage Therapy',
    confirmBookingTitle: 'Підтвердження резервування массажу',
    confirmBookingMessage: 'Будь ласка, перейдіть за посиланням нижче, щоб підтвердити своє бронювання'
  }
}
