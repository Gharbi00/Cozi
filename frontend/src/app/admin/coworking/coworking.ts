import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService, BookingDto } from '../../shared/services/admin-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coworking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './coworking.html',
  styleUrl: './coworking.scss',
})
export class Coworking implements OnInit {
  protected stats = [
    { label: 'Desk capacity', value: '0', progress: 0, variant: 'bg-success' },
    { label: 'Active members', value: '96', progress: 80, variant: 'bg-info' },
    { label: 'Weekly revenue', value: '$9,560', progress: 76, variant: 'bg-primary' },
    { label: 'Meeting room use', value: '39%', progress: 39, variant: 'bg-warning' },
  ];

  protected reservations: BookingDto[] = [];

  protected readonly membership = [
    { title: 'Daily passes', value: '24 sold' },
    { title: 'Monthly plans', value: '12 active' },
    { title: 'Conference bookings', value: '6 this month' },
  ];

  constructor(@Inject(AdminApiService) private readonly adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  protected loadReservations(): void {
    this.adminApi.getBookings().subscribe((page) => {
      this.reservations = page.content.filter((booking) => booking.bookingType === 'COWORKING');
      this.stats[0].value = `${this.reservations.length}`;
      this.stats[0].progress = Math.min(100, this.reservations.length * 8);
    });
  }

  protected createQuickReservation(): void {
    const booking: BookingDto = {
      userId: 2,
      coworkingId: 1,
      bookingType: 'COWORKING',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      totalPrice: 120,
      status: 'Pending',
    };

    this.adminApi.createBooking(booking).subscribe({
      next: () => {
        this.loadReservations();
        Swal.fire({
          icon: 'success',
          title: 'Reservation created',
          text: 'The coworking reservation was created successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Quick reservation failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Create failed',
          text: 'Unable to create quick reservation. Please try again.',
        });
      },
    });
  }

  protected toggleReservationStatus(reservation: BookingDto): void {
    if (!reservation.id) {
      return;
    }

    const updated: BookingDto = {
      ...reservation,
      status: reservation.status === 'Confirmed' ? 'Pending' : 'Confirmed',
    };

    this.adminApi.updateBooking(reservation.id, updated).subscribe({
      next: () => {
        this.loadReservations();
        Swal.fire({
          icon: 'success',
          title: 'Reservation updated',
          text: 'The reservation status has been updated.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Reservation update failed', error);
        Swal.fire({
          icon: 'error',
          title: 'Update failed',
          text: 'Unable to update reservation. Please try again.',
        });
      },
    });
  }

  protected deleteReservation(reservation: BookingDto): void {
    if (!reservation.id) {
      return;
    }

    Swal.fire({
      title: 'Delete reservation?',
      text: 'This reservation will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.adminApi.deleteBooking(reservation.id!).subscribe({
        next: () => {
          this.loadReservations();
          Swal.fire({
            icon: 'success',
            title: 'Reservation deleted',
            text: 'The reservation has been deleted.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        error: (error) => {
          console.error('Reservation deletion failed', error);
          Swal.fire({
            icon: 'error',
            title: 'Delete failed',
            text: 'Unable to delete reservation. Please try again.',
          });
        },
      });
    });
  }
}
