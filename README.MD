# Massage Therapy BE

This is a system for booking time slots for massage sessions. It includes authenticatio, user profile and admin functionality.

## Features

<!-- Features are located in the `src/app/modules/lazy` folder: they are all routable and loaded lazily.
- main - contains the landing page with components that represent sections of the page.
- auth - contains authentication flow and logic: register, login, reset password etc.
- booking - contains the booking flow and logic: cart, select product page, checkout page etc.
- admin - has all the logic related to the content management.
- user - used for displaying user related data and bookings. -->

## Folders overview

<!-- All the main modules (e.g. CoreModule and SharedModule) are loaded into AppModule.
The entry point for application-related logic is app.component.ts, it loads among others CoreModule and SharedModule, inits i18n logic.
- core - contains singletons, constants, decorators, upper-level routing and i18n.
- shared - contains dumb UI components, pipes, utils, directives and abstract classes.
- interfaces - is the entry point for all app-wide interfaces that are used in more than one module.
- modules - is the place for business modules (in "lazy" folder because they are lazy loadable) and UI modules (e.g. dialog). -->

## Environments

The application has three environments:
- local: .env.local
- stage: .env.mt-stage-db6be
- prod: .env.mt-prod-30347

## CLI commands
  - run linter: `npm run lint`
  - run tests: `npm run test`
  - configure Firebase secret: `firebase functions:secrets:set <SECRET_NAME> --project <project_id>`
  - list Firebase projects: `firebase projects:list`
  - switch to a specific Firebase project: `firebase use <project_id>`
  - kill process not ended greacefully: `lsof -t -i tcp:5004 | xargs kill`
  - deploy specific function: `firebase deploy --only functions:content`

## Project overview
  - The root of the project contains `index.ts` file which exports all Firebase functions as module exports. This is required for deployment to Firebase cloud.
  - Integration tests are located in the tests folder. Tests are run with spinning up Firestore locally on every commit with Husky script.
  - The project includes three environments: local, stage, prod.
  - All APIs are contained in the folders as per business domain: auth, booking, content, manager, user.
  - Each feature usually inculdes at least three files: function, validator, interface.
  - Shared folder includes folders: constants, interfaces, models and utils. Models folder includes util classes to make it simpler to create business related objects.

## Linting rules
https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js

## Firebase admins contacts
https://firebase.google.com/support/troubleshooter/contact

## Firestore usage
https://console.cloud.google.com/firestore/databases
