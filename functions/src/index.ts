import { initializeApp } from 'firebase-admin/app';
import { LoginFunction, RegisterConfirmFunction, RegisterFunction, RemindFunction, ResetFunction } from './auth';
import { UserGetFunction } from './user';
import { ProductCreateFunction, ProductGetFunction } from './product';
import { Seed } from './scripts/seed/seed';

initializeApp();

// Auth
exports.register = RegisterFunction;
exports.login = LoginFunction;
exports.remind = RemindFunction;
exports.reset = ResetFunction;
exports.registerConfirm = RegisterConfirmFunction;
exports.profile = UserGetFunction;
export const register = RegisterFunction;
export const login = LoginFunction;
export const remind = RemindFunction;
export const reset = ResetFunction;
export const registerConfirm = RegisterConfirmFunction;

// User
exports.userGet = UserGetFunction;
export const userGet = UserGetFunction;

// Product
exports.productCreate = ProductCreateFunction;
exports.productGet = ProductGetFunction;
export const productGet = ProductGetFunction;
export const productCreate = ProductCreateFunction;

// Seed database
Seed();
