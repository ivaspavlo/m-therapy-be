// import { logger } from 'firebase-functions';
// import { onRequest } from 'firebase-functions/v2/https';
// import { onDocumentCreated } from 'firebase-functions/v2/firestore';
// import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { RegisterFunction } from './auth';

initializeApp();

exports.register = RegisterFunction;
