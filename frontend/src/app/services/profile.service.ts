import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProfileResponse {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/profile';

  getUserDetails(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.API_URL}/details`, { withCredentials: true });
  }

  // Controller currently accepts @RequestBody String, so send plain text.
  verifyCurrentPassword(currentPassword: string): Observable<string> {
    return this.http.post(`${this.API_URL}/password/reset/verify`, currentPassword, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  resetPassword(password: string): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/password/reset`,
      { password },
      { withCredentials: true },
    );
  }
}
