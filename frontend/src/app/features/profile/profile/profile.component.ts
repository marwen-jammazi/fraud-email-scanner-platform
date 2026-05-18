import { Component, OnInit } from '@angular/core';
import {
  ProfileResponse,
  ProfileService,
} from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: ProfileResponse | null = null;

  loading = false;
  savingProfile = false;
  changingPassword = false;
  uploadingPicture = false;

  errorMessage = '';
  successMessage = '';
  passwordMessage = '';

  profileForm = {
    fullName: '',
    email: '',
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  imageLoadFailed = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.imageLoadFailed = false;

    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;

        this.profileForm = {
          fullName: profile.fullName,
          email: profile.email,
        };

        this.imagePreview = this.profileService.buildImageUrl(
          profile.profilePictureUrl,
        );

        localStorage.setItem('fullName', profile.fullName);
        localStorage.setItem('email', profile.email);

        if (profile.profilePictureUrl) {
          localStorage.setItem('profilePictureUrl', profile.profilePictureUrl);
        } else {
          localStorage.removeItem('profilePictureUrl');
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Profile load error:', error);
        this.errorMessage = 'Failed to load profile.';
        this.loading = false;
      },
    });
  }

  saveProfile(): void {
    this.savingProfile = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService.updateMyProfile(this.profileForm).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.successMessage = 'Profile updated successfully.';
        this.savingProfile = false;

        localStorage.setItem('fullName', profile.fullName);
        localStorage.setItem('email', profile.email);
      },
      error: (error) => {
        console.error('Profile update error:', error);
        this.errorMessage = 'Failed to update profile.';
        this.savingProfile = false;
      },
    });
  }

  changePassword(): void {
    this.passwordMessage = '';

    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
      this.passwordMessage = 'Please fill both password fields.';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.passwordMessage = 'New password must contain at least 6 characters.';
      return;
    }

    this.changingPassword = true;

    this.profileService.changePassword(this.passwordForm).subscribe({
      next: (message) => {
        this.passwordMessage = message || 'Password changed successfully.';
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
        };
        this.changingPassword = false;
      },
      error: (error) => {
        console.error('Password change error:', error);
        this.passwordMessage = 'Failed to change password.';
        this.changingPassword = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.imageLoadFailed = false;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadPicture(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a profile picture first.';
      return;
    }

    this.uploadingPicture = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.imageLoadFailed = false;

    this.profileService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.imagePreview = this.profileService.buildImageUrl(
          profile.profilePictureUrl,
        );
        this.uploadingPicture = false;
        this.successMessage = 'Profile picture updated successfully.';

        if (profile.profilePictureUrl) {
          localStorage.setItem('profilePictureUrl', profile.profilePictureUrl);
        }
      },
      error: (error) => {
        console.error('Picture upload error:', error);
        this.errorMessage = 'Failed to upload profile picture.';
        this.uploadingPicture = false;
      },
    });
  }

  getAvatarUrl(): string | null {
    if (this.imageLoadFailed) {
      return null;
    }

    return this.imagePreview;
  }

  onImageError(): void {
    this.imageLoadFailed = true;
    this.imagePreview = null;
    localStorage.removeItem('profilePictureUrl');
  }
}