import { initializeApp } from 'firebase-admin/app';
import { RegisterFunction } from './auth';

initializeApp();

exports.register = RegisterFunction;
