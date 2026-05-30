import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = 'http://localhost:8080/api/auth';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const payload: AuthRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, payload);
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const payload: RegisterRequest = { firstName, lastName, email, password };
    return this.http.post<any>(`${this.authUrl}/register`, payload);
  }
}
