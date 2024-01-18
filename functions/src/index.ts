import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterConfirmFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { UserFunction } from './user';
import { ProductCreateFunction, ProductGetFunction } from './product';
import { Seed } from './shared/utils';

initializeApp();

// Auth
exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;
exports.registerConfirm = RegisterConfirmFunction;
exports.profile = UserFunction;
export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
export const registerConfirm = RegisterConfirmFunction;

// User
exports.userGet = UserFunction;
export const userGet = UserFunction;

// Product
exports.productCreate = ProductCreateFunction;
exports.productGet = ProductGetFunction;
export const productGet = ProductGetFunction;
export const productCreate = ProductCreateFunction;

// Seed database
Seed();
