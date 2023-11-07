import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { ManagerFunction } from './manager/manager.function';

initializeApp();

exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;
exports.manager = ManagerFunction;

export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
export const manager = ManagerFunction;
