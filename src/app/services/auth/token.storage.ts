import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
    private tokenKey = 'authToken';

    signOut(): void {
        window.localStorage.removeItem(this.tokenKey);
        window.localStorage.clear();
    }

    saveToken(token?: string): void {
        if (!token) return;
        window.localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return window.localStorage.getItem(this.tokenKey);
    }
}