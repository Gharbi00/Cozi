import { Component, ViewChild, ElementRef } from '@angular/core';
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
export class Auth {
  @ViewChild('authModal') authModal!: ElementRef;
  
  activeTab: 'login' | 'register' | 'forgot' = 'login';
  modal!: Modal;

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

  ngAfterViewInit() {
    this.modal = new Modal(this.authModal.nativeElement);
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
      alert('Please enter both email and password.');
      return;
    }

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        alert('Login successful.');
        this.closeModal();
        this.resetForms();
      },
      error: (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }

  onRegister() {
    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      alert('Please fill in all registration fields.');
      return;
    }

    const [firstName, ...remaining] = this.registerName.trim().split(' ');
    const lastName = remaining.join(' ') || 'User';

    this.authService.register(firstName, lastName, this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        alert('Registration successful. Please log in.');
        this.switchTab('login');
        this.resetForms();
      },
      error: (error) => {
        console.error('Registration failed', error);
        alert('Registration failed. Please try again.');
      },
    });
  }

  onForgotPassword() {
    if (!this.forgotEmail) {
      alert('Please enter your email address.');
      return;
    }

    alert('Forgot password is not yet connected to backend logic. Please contact support or try logging in again later.');
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
