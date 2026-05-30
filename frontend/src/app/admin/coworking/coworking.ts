import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService, BookingDto } from '../../shared/services/admin-api.service';

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

    this.adminApi.createBooking(booking).subscribe(() => this.loadReservations());
  }

  protected toggleReservationStatus(reservation: BookingDto): void {
    if (!reservation.id) {
      return;
    }

    const updated: BookingDto = {
      ...reservation,
      status: reservation.status === 'Confirmed' ? 'Pending' : 'Confirmed',
    };

    this.adminApi.updateBooking(reservation.id, updated).subscribe(() => this.loadReservations());
  }

  protected deleteReservation(reservation: BookingDto): void {
    if (!reservation.id) {
      return;
    }

    this.adminApi.deleteBooking(reservation.id).subscribe(() => this.loadReservations());
  }
}
