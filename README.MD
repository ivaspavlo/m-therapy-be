# Run instructions

## Run lint
npm run lint

## Run tests
npm run test

## Run locally
npm run debug


# Firebase commands

## Configure Google Secret:
firebase functions:secrets:set [SECRET_NAME] --project [project_id]

## Show list of Firebase projects
firebase projects:list

## Switch to a specific project
firebase use [project_id]

# Additional information

## Lint rules
https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js

## Firebase admins contacts
https://firebase.google.com/support/troubleshooter/contact

## Firestore usage
https://console.cloud.google.com/firestore/databases

## Kill process
lsof -t -i tcp:5004 | xargs kill
