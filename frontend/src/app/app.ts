
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, finalize } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly API_URL = 'http://localhost:8080/auth';

  isRegisterMode = false;
  isLoading = false;
  isLoggingOut = false;

  errorMessage = '';
  successMessage = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.router.events
        .pipe(
            filter(
                (event): event is NavigationEnd =>
                    event instanceof NavigationEnd,
            ),
        )
        .subscribe((event) => {
          const url = event.urlAfterRedirects;

          if (url === '/' || url === '') {
            this.resetAuthScreen();
          }
        });
  }

  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  get registerName() {
    return this.registerForm.get('name');
  }

  get registerEmail() {
    return this.registerForm.get('email');
  }

  get registerPassword() {
    return this.registerForm.get('password');
  }

  get isHomePage(): boolean {
    return this.router.url === '/home';
  }

  showRegister(): void {
    this.isRegisterMode = true;
    this.clearMessages();
    this.loginForm.reset();
    this.registerForm.reset();
    this.cdr.detectChanges();
  }

  showLogin(): void {
    this.isRegisterMode = false;
    this.clearMessages();
    this.loginForm.reset();
    this.registerForm.reset();
    this.cdr.detectChanges();
  }

  login(): void {
    this.clearMessages();

    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const loginData = this.loginForm.getRawValue();
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http
        .post(
            `${this.API_URL}/login`,
            loginData,
            {
              responseType: 'text',
              withCredentials: true,
            },
        )
        .pipe(
            finalize(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            }),
        )
        .subscribe({
          next: (response: string) => {
            this.errorMessage = '';
            this.successMessage = response || 'Login Successful';

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem(
                'user',
                JSON.stringify({ email: loginData.email }),
            );

            // Clear the submitted credentials from the visible form.
            this.loginForm.reset();
            this.cdr.detectChanges();

            void this.router.navigateByUrl('/home');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Login request failed:', error);
            this.successMessage = '';
            this.errorMessage = this.getErrorMessage(
                error,
                'Login failed. Please check your email and password.',
            );
          },
        });
  }

  register(): void {
    this.clearMessages();

    if (this.registerForm.invalid || this.isLoading) {
      this.registerForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const registerData = this.registerForm.getRawValue();
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http
        .post(
            `${this.API_URL}/register`,
            registerData,
            { responseType: 'text' },
        )
        .pipe(
            finalize(() => {
              this.isLoading = false;
              this.cdr.detectChanges();
            }),
        )
        .subscribe({
          next: (response: string) => {
            this.successMessage =
                response || 'Registration successful.';
            this.errorMessage = '';
            this.registerForm.reset();
            this.cdr.detectChanges();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Registration request failed:', error);
            this.successMessage = '';
            this.errorMessage = this.getErrorMessage(
                error,
                'Registration failed. Please try again.',
            );
            this.cdr.detectChanges();
          },
        });
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    this.authService
        .logout()
        .pipe(
            finalize(() => {
              this.clearLocalSession();
              this.isLoggingOut = false;
            }),
        )
        .subscribe({
          next: () => {
            void this.router.navigateByUrl('/');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Logout request failed:', error);

            // Always remove local session data. The backend may still
            // need to be contacted successfully to revoke the token.
            void this.router.navigateByUrl('/');
          },
        });
  }

  private resetAuthScreen(): void {
    this.isRegisterMode = false;
    this.isLoading = false;
    this.clearMessages();
    this.loginForm.reset();
    this.registerForm.reset();
    this.cdr.detectChanges();
  }

  private clearLocalSession(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private getErrorMessage(
      error: HttpErrorResponse,
      fallback: string,
  ): string {
    const body = error.error;

    if (typeof body === 'string' && body.trim()) {
      return body.replace(/^Error:\s*/i, '');
    }

    if (body && typeof body === 'object') {
      return (
          body.message ||
          body.defaultMessage ||
          body.detail ||
          body.error ||
          fallback
      );
    }

    return fallback;
  }
}
