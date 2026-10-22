import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProfileResponse {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly PROFILE_URL = 'http://localhost:8080/profile';

  getUserDetails(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.PROFILE_URL}/details`, {
      withCredentials: true,
    });
  }

  verifyCurrentPassword(currentPassword: string): Observable<string> {
    return this.http.post(`${this.PROFILE_URL}/password/reset/verify`, currentPassword, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  resetPassword(password: string): Observable<void> {
    return this.http.post<void>(
      `${this.PROFILE_URL}/password/reset`,
      { password },
      {
        withCredentials: true,
      },
    );
  }
}
