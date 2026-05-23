import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, timer } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = {
    email: '',
    password: '',
  };

  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loading) {
      return;
    }

    this.errorMessage = '';

    if (!this.form.email.trim() || !this.form.password.trim()) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.loading = true;

    forkJoin({
      response: this.authService.login({
        email: this.form.email.trim(),
        password: this.form.password,
      }),
      animationDelay: timer(950),
    }).subscribe({
      next: () => {
        this.loading = false;
        window.dispatchEvent(
          new CustomEvent('fraudscanner:show-post-login-loader'),
        );
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        setTimeout(() => {
          this.loading = false;
          this.errorMessage = 'Invalid email or password.';
        }, 500);
      },
    });
  }
}