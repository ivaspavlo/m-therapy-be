import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterFunction, RemindFunction } from './auth';

initializeApp();

exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
