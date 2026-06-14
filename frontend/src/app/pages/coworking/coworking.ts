import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../shared/services/admin-api.service';
import Swal from 'sweetalert2';

interface CoworkingSpot {
  id: number;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  available: boolean;
}

@Component({
  selector: 'app-coworking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coworking.html',
  styleUrls: ['./coworking.scss'],
})
export class Coworking {
  coworkingSpots: CoworkingSpot[] = [
    {
      id: 1,
      name: 'Open Plan Desk',
      location: 'Downtown',
      description: 'Flexible desk in a shared coworking environment.',
      pricePerHour: 15,
      available: true,
    },
    {
      id: 2,
      name: 'Private Office',
      location: 'City Center',
      description: 'Quiet private office for focused work.',
      pricePerHour: 35,
      available: true,
    },
    {
      id: 3,
      name: 'Meeting Room',
      location: 'Business District',
      description: 'Bookable meeting room with AV support.',
      pricePerHour: 45,
      available: true,
    },
  ];

  selectedSpotId: number | null = null;
  bookingDate = '';
  bookingHours = 1;
  bookingMessage = '';
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private readonly api: AdminApiService) {}

  get selectedSpot(): CoworkingSpot | undefined {
    return this.coworkingSpots.find((spot) => spot.id === this.selectedSpotId);
  }

  createBooking() {
    this.submitError = '';
    this.submitSuccess = false;

    const userId = Number(localStorage.getItem('userId'));
    if (!userId || !this.selectedSpotId || !this.bookingDate) {
      this.submitError = 'Please select a workspace, choose a date, and enter the duration.';
      return;
    }

    const bookingDto = {
      userId,
      coworkingId: this.selectedSpotId,
      bookingType: 'COWORKING' as const,
      startDate: this.bookingDate,
      endDate: this.bookingDate,
      totalPrice: this.bookingHours * (this.selectedSpot?.pricePerHour ?? 0),
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
          text: 'Your coworking reservation is confirmed.',
          timer: 1800,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Booking failed', error);
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
    this.selectedSpotId = null;
    this.bookingDate = '';
    this.bookingHours = 1;
    this.bookingMessage = '';
  }
}
