import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  isDarkTheme = false;
  sidebarImageFailed = false;
  showPostLoginLoader = false;

  private postLoginLoaderTimer?: number;

  private readonly postLoginLoaderHandler = (): void => {
    this.showApplicationLoader();
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');

    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();

    window.addEventListener(
      'fraudscanner:show-post-login-loader',
      this.postLoginLoaderHandler,
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'fraudscanner:show-post-login-loader',
      this.postLoginLoaderHandler,
    );

    if (this.postLoginLoaderTimer) {
      window.clearTimeout(this.postLoginLoaderTimer);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  isAnalyst(): boolean {
    return localStorage.getItem('role') === 'ANALYST';
  }

  canViewAuditLogs(): boolean {
    return this.isAdmin() || this.isAnalyst();
  }

  canViewScannedEmails(): boolean {
    return !this.isAnalyst();
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

  logout(): void {
    this.showPostLoginLoader = false;
    this.authService.logout();
  }

  private showApplicationLoader(): void {
    this.showPostLoginLoader = true;

    if (this.postLoginLoaderTimer) {
      window.clearTimeout(this.postLoginLoaderTimer);
    }

    this.postLoginLoaderTimer = window.setTimeout(() => {
      this.showPostLoginLoader = false;
    }, 1450);
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }
}
