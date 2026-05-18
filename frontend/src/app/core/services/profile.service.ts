import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  profilePictureUrl?: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/api/profile/me`);
  }

  updateMyProfile(payload: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.apiUrl}/api/profile/me`, payload);
  }

  changePassword(payload: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/api/profile/me/password`, payload, {
      responseType: 'text',
    });
  }

  uploadProfilePicture(file: File): Observable<ProfileResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ProfileResponse>(
      `${this.apiUrl}/api/profile/me/picture`,
      formData
    );
  }

  buildImageUrl(profilePictureUrl?: string): string | null {
    if (!profilePictureUrl) {
      return null;
    }

    if (profilePictureUrl.startsWith('http')) {
      return profilePictureUrl;
    }

    return `http://localhost:8081${profilePictureUrl}`;
  }
}
