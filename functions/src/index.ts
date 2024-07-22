import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterConfirmFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { UserFunction } from './user';
import { ContentFunction } from './content';
import { ManagerFunction } from './manager';
import { Seed } from './shared/utils';
import { BookingFunction } from './booking';

initializeApp();

exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;
exports.registerConfirm = RegisterConfirmFunction;
exports.manager = ManagerFunction;
exports.user = UserFunction;
exports.content = ContentFunction;
exports.booking = BookingFunction;

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
