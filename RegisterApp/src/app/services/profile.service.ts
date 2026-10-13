import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProfileResponse {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8080/profile';

  getUserDetails(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${this.API_URL}/details`,
      { withCredentials: true }
    );
  }
}
