import { api } from './api';

export type User = {
    id: string;
    email: string;
    name: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    name: string;
};

export function login(payload: LoginPayload) {
    return api<{ user: User }>('/auth/login', {
        method: 'POST',
        body: payload,
    });
}

export function register(payload: RegisterPayload) {
    return api<{ user: User }>('/auth/register', {
        method: 'POST',
        body: payload,
    });
}

export function getCurrentUser() {
    return api<User>('/auth/me');
}

export function logout() {
    return api<{ message: string }>('/auth/logout', {
        method: 'POST',
    });
}
