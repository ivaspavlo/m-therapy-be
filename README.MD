# Run instructions

## CLI commands
  - run linter: `npm run lint`
  - run tests: `npm run test`
  - configure Firebase secret: `firebase functions:secrets:set <SECRET_NAME> --project <project_id>`
  - list Firebase projects: `firebase projects:list`
  - switch to a specific Firebase project: `firebase use <project_id>`
  - kill process not ended greacefully: `lsof -t -i tcp:5004 | xargs kill`

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
