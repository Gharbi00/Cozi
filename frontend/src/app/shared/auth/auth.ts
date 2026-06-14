import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit, AfterViewInit {
  @ViewChild('authModal') authModal!: ElementRef;
  
  activeTab: 'login' | 'register' | 'forgot' = 'login';
  modal!: Modal;
  isLoggedIn = false;

  // Login form
  loginEmail = '';
  loginPassword = '';
  loginRemember = false;

  // Register form
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerTerms = false;

  // Forgot password form
  forgotEmail = '';

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.updateLoginState();
  }

  ngAfterViewInit() {
    this.modal = new Modal(this.authModal.nativeElement);
  }

  updateLoginState() {
    const token = localStorage.getItem('authToken');
    const roles = localStorage.getItem('userRoles');
    this.isLoggedIn = !!token && !!roles;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userId');
    this.updateLoginState();
    Swal.fire({
      icon: 'success',
      title: 'Logged out',
      text: 'You have been logged out.',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

  switchTab(tab: 'login' | 'register' | 'forgot') {
    this.activeTab = tab;
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing credentials',
        text: 'Please enter both email and password.',
      });
      return;
    }

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response: any) => {
        localStorage.setItem('authToken', response.token);
        if (response.roles) {
          localStorage.setItem('userRoles', JSON.stringify(response.roles));
        }
        if (response.userId) {
          localStorage.setItem('userId', String(response.userId));
        }
        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.closeModal();
        this.resetForms();
        // Redirect to admin if user has ADMIN role
        this.updateLoginState();
        if (response.roles?.includes('ADMIN')) {
          globalThis.location.href = '/admin';
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Please check your credentials and try again.',
        });
      },
    });
  }

  onRegister() {
    if (this.registerPassword !== this.registerConfirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password mismatch',
        text: 'Passwords do not match.',
      });
      return;
    }

    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing information',
        text: 'Please fill in all registration fields.',
      });
      return;
    }

    const [firstName, ...remaining] = this.registerName.trim().split(' ');
    const lastName = remaining.join(' ') || 'User';

    this.authService.register(firstName, lastName, this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration complete',
          text: 'Please log in with your new credentials.',
          timer: 1800,
          showConfirmButton: false,
        });
        this.switchTab('login');
        this.resetForms();
      },
      error: (error) => {
        console.error('Registration failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          text: 'Please try again.',
        });
      },
    });
  }

  onForgotPassword() {
    if (!this.forgotEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Email required',
        text: 'Please enter your email address.',
      });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Feature pending',
      text: 'Forgot password is not yet connected to backend logic. Please contact support or try logging in again later.',
    });
    this.switchTab('login');
    this.resetForms();
  }

  resetForms() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.loginRemember = false;
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.registerTerms = false;
    this.forgotEmail = '';
  }
}
