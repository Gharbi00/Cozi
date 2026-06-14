import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService, BookingDto } from '../../shared/services/admin-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coliving',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './coliving.html',
  styleUrl: './coliving.scss',
})
export class Coliving implements OnInit {
  protected stats = [
    { label: 'Current occupancy', value: '0%', progress: 0, variant: 'bg-success' },
    { label: 'Available units', value: '0', progress: 0, variant: 'bg-warning' },
    { label: 'Monthly revenue', value: '$16,800', progress: 84, variant: 'bg-info' },
    { label: 'Average stay', value: '28 nights', progress: 70, variant: 'bg-primary' },
  ];

  protected bookings: BookingDto[] = [];

  protected readonly facilityMetrics = [
    { title: 'Private rooms', value: '18/20 available' },
    { title: 'Shared kitchen bookings', value: '42 this month' },
    { title: 'Community events', value: '8 scheduled' },
  ];

  constructor(@Inject(AdminApiService) private readonly adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  protected loadBookings(): void {
    this.adminApi.getBookings().subscribe((page) => {
      this.bookings = page.content.filter((booking) => booking.bookingType === 'COLIVING');
      this.stats[0].value = `${this.bookings.length}%`;
      this.stats[1].value = `${Math.max(0, 10 - this.bookings.length)} available`;
    });
  }

  protected createQuickBooking(): void {
    const booking: BookingDto = {
      userId: 1,
      colivingId: 1,
      bookingType: 'COLIVING',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      totalPrice: 950,
      status: 'Pending',
    };

    this.adminApi.createBooking(booking).subscribe({
      next: () => {
        this.loadBookings();
        Swal.fire({
          icon: 'success',
          title: 'Booking created',
          text: 'The coliving booking was created successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Quick booking failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Create failed',
          text: 'Unable to create quick booking. Please try again.',
        });
      },
    });
  }

  protected toggleBookingStatus(booking: BookingDto): void {
    if (!booking.id) {
      return;
    }

    const updated: BookingDto = {
      ...booking,
      status: booking.status === 'Confirmed' ? 'Pending' : 'Confirmed',
    };

    this.adminApi.updateBooking(booking.id, updated).subscribe({
      next: () => {
        this.loadBookings();
        Swal.fire({
          icon: 'success',
          title: 'Booking updated',
          text: 'The booking status has been updated.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Booking update failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: 'Unable to update booking status. Please try again.',
        });
      },
    });
  }

  protected deleteBooking(booking: BookingDto): void {
    if (!booking.id) {
      return;
    }

    Swal.fire({
      title: 'Delete booking?',
      text: 'This booking will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.adminApi.deleteBooking(booking.id!).subscribe({
        next: () => {
          this.loadBookings();
          Swal.fire({
            icon: 'success',
            title: 'Booking deleted',
            text: 'The booking has been deleted.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        error: (error) => {
          console.error('Booking deletion failed', error);
          Swal.fire({
            icon: 'error',
            title: 'Delete failed',
            text: 'Unable to delete booking. Please try again.',
          });
        },
      });
    });
  }
}
