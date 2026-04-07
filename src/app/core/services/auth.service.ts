import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  name: string;
  role: UserRole;
}

const STORAGE_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(this.readFromStorage());
  readonly user$ = this._user$.asObservable();

  get user(): User | null {
    return this._user$.value;
  }

  login(name: string, role: UserRole) {
    const u: User = { name, role };
    this._user$.next(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }

  logout() {
    this._user$.next(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private readFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  }
}