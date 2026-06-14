import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../shared/services/admin-api.service';
import Swal from 'sweetalert2';

declare const $: any;

interface ColivingSuite {
  id: number;
  title: string;
  location: string;
  details: string;
  pricePerNight: number;
  available: boolean;
}

@Component({
  selector: 'app-coliving',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coliving.html',
  styleUrls: ['./coliving.scss'],
})
export class Coliving implements AfterViewInit {
  colivingSuites: ColivingSuite[] = [
    {
      id: 1,
      title: 'Sea View Suite',
      location: 'Beachfront',
      details: 'Private suite with sea view, kitchen, and workspace access.',
      pricePerNight: 95,
      available: true,
    },
    {
      id: 2,
      title: 'Creative Loft',
      location: 'City Center',
      details: 'Open-plan loft with community kitchen and meeting spaces.',
      pricePerNight: 80,
      available: true,
    },
    {
      id: 3,
      title: 'Garden Room',
      location: 'Tranquil Courtyard',
      details: 'Cozy private room with garden access and communal lounge.',
      pricePerNight: 70,
      available: true,
    },
  ];

  selectedSuiteId: number | null = null;
  checkInDate = '';
  nights = 1;
  bookingMessage = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private readonly api: AdminApiService) {}

  get selectedSuite(): ColivingSuite | undefined {
    return this.colivingSuites.find((suite) => suite.id === this.selectedSuiteId);
  }

  computeEndDate(): string {
    if (!this.checkInDate) {
      return this.checkInDate;
    }
    const date = new Date(this.checkInDate);
    date.setDate(date.getDate() + this.nights);
    return date.toISOString().slice(0, 10);
  }

  createBooking() {
    this.submitError = '';
    this.submitSuccess = false;
    const userId = Number(localStorage.getItem('userId'));
    if (!userId || !this.selectedSuiteId || !this.checkInDate || this.nights < 1) {
      this.submitError = 'Please select a suite, choose a check-in date, and enter the number of nights.';
      return;
    }

    const totalPrice = (this.selectedSuite?.pricePerNight ?? 0) * this.nights;
    const bookingDto = {
      userId,
      colivingId: this.selectedSuiteId,
      bookingType: 'COLIVING' as const,
      startDate: this.checkInDate,
      endDate: this.computeEndDate(),
      totalPrice,
      status: 'PENDING',
      notes: this.bookingMessage,
    };

    this.isSubmitting = true;
    this.api.createBooking(bookingDto).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        this.resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Booking created',
          text: 'Your coliving reservation is confirmed.',
          timer: 1800,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Coliving booking failed', error);
        this.submitError = 'Booking failed. Please try again later or log in first.';
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Booking failed',
          text: 'Please try again later or log in first.',
        });
      },
    });
  }

  resetForm() {
    this.selectedSuiteId = null;
    this.checkInDate = '';
    this.nights = 1;
    this.bookingMessage = '';
  }

  ngAfterViewInit() {
    if (typeof $ === 'undefined' || !$('#checkInDate').datepicker) {
      return;
    }

    $('#checkInDate').datepicker({
      icons: {
        rightIcon: '<i class="fas fa-angle-down"></i>'
      },
      format: 'yyyy-mm-dd',
      uiLibrary: 'bootstrap5',
      iconsLibrary: 'fontawesome'
    }).on('change', (event: any) => {
      this.checkInDate = event.target?.value || this.checkInDate;
    });
  }

}
