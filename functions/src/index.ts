import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';

initializeApp();

exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;

export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
