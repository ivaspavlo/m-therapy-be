import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterFunction } from './auth';

initializeApp();

exports.register = RegisterFunction;
exports.login = LoginFunction;
