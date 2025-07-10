# Massage Therapy BE

This is a system for booking time slots for massage sessions. It also includes authenticatio, user profile and admin functionality.

## Project overview
  - The root of the project contains `index.ts` file which exports all Firebase functions as module exports. This is required for deployment to Firebase cloud.
  - Integration tests are located in the tests folder. Tests are run with spinning up Firestore locally on every commit with Husky script.
  - All APIs are contained in the folders as per business domain: auth, booking, content, manager, user etc.
  - Each feature usually inculdes at least three files: function, validator, interface.
  - Shared folder includes folders: constants, interfaces, models and utils. Models folder includes util classes to make it simpler to create business related objects.

## Features

Business:
Features are located in `src` folder in the separate folder each:
- auth - auth related APIs, e.g. register, login, reset password etc.
- user - user management APIs, e.g. get user, delete user etc.
- booking - booking related APIs, e.g. book time slot, cancel time slot etc.
- admin - APIs related to the appliation management.
- content - simple endpoint for fetching data to populate the main web page.

Security:
- CORS setup in every function.
- Google Secrets for storing sensitive information.
- JWT for protecting the APIs.

Additional:
- Database seeding setup during the init time.
- Email templates are stored in the `functions/assets` folder.
- Eslint is used for linting: https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js.
- Jest is used for testing along with the Firebase tooling.

## Environments

The application has three environments:
- local: set up via .env file. It is needed mostly in testing.
- stage: set up via .env.mt-stage-db6be
- prod: set up via .env.mt-prod-17c09

The correct env file is used automatically by Github action during the deployment.
For the integration test dotenv is used to set up the local env.

## CLI commands
  - run linter: `npm run lint`
  - run tests: `npm run test`
  - configure Firebase secret: `firebase functions:secrets:set <SECRET_NAME> --project <project_id>`
  - list Firebase projects: `firebase projects:list`
  - switch to a specific Firebase project: `firebase use <project_id>`
  - kill process not ended greacefully: `lsof -t -i tcp:5004 | xargs kill`
  - deploy specific function: `firebase deploy --only functions:content`

## Firebase admins contacts
https://firebase.google.com/support/troubleshooter/contact

## Firestore usage
https://console.cloud.google.com/firestore/databases

## Gmail passwords management
https://myaccount.google.com/apppasswords
