import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterConfirmFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { UserFunction } from './user';
import { AdFunction, ProductFunction } from './product';
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

// Product
exports.product = ProductFunction;
exports.ad = AdFunction;

// Exports for unit-tests
export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
export const registerConfirm = RegisterConfirmFunction;
export const product = ProductFunction;
export const user = UserFunction;

// Seed DB
Seed();
