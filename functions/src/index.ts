import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterConfirmFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { UserFunction } from './user';
import { ContentFunction } from './content';
import { Seed } from './shared/utils';

initializeApp();

// Auth
exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;
exports.registerConfirm = RegisterConfirmFunction;
exports.profile = UserFunction;

// User
exports.user = UserFunction;

// Content
exports.content = ContentFunction;

// Exports for unit-tests
export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
export const registerConfirm = RegisterConfirmFunction;
export const user = UserFunction;
export const content = ContentFunction;

// Seed DB
Seed();
