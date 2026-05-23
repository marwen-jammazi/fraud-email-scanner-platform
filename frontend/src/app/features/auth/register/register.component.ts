import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { forkJoin, timer } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form = {
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
  };

  errorMessage = '';
  successMessage = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  register(registerForm: NgForm): void {
    if (this.loading) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (registerForm.invalid) {
      this.errorMessage =
        'Please enter a valid email and a password with at least 6 characters.';
      return;
    }

    this.loading = true;

    forkJoin({
      response: this.authService.register({
        fullName: this.form.fullName.trim(),
        email: this.form.email.trim(),
        password: this.form.password,
        role: 'USER',
      }),
      animationDelay: timer(1100),
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage =
          'Account created successfully. You can now login.';

        this.form = {
          fullName: '',
          email: '',
          password: '',
          role: 'USER',
        };

        registerForm.resetForm({
          fullName: '',
          email: '',
          password: '',
          role: 'USER',
        });
      },
      error: (error) => {
        setTimeout(() => {
          this.loading = false;

          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.status === 409) {
            this.errorMessage = 'This email is already used.';
          } else {
            this.errorMessage = `Registration failed. Status: ${error.status}`;
          }
        }, 500);
      },
    });
  }
}