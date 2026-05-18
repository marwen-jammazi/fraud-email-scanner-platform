import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isDarkTheme = false;
  sidebarImageFailed = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');

    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getFullName(): string | null {
    return localStorage.getItem('fullName');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getProfilePictureUrl(): string | null {
    if (this.sidebarImageFailed) {
      return null;
    }

    const url = localStorage.getItem('profilePictureUrl');

    if (!url) {
      return null;
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `http://localhost:8081${url}`;
  }

  onSidebarImageError(): void {
    this.sidebarImageFailed = true;
    localStorage.removeItem('profilePictureUrl');
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  logout(): void {
    this.authService.logout();
  }
}