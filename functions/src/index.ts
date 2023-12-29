import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterConfirmFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { ProfileFunction } from './user';

initializeApp();

// Auth
exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;
exports.registerConfirm = RegisterConfirmFunction;
exports.profile = ProfileFunction;
export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
export const registerConfirm = RegisterConfirmFunction;

// User
export const profile = ProfileFunction;

// Product

