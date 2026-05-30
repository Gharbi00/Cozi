import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService, BookingDto } from '../../shared/services/admin-api.service';

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

    this.adminApi.createBooking(booking).subscribe(() => this.loadBookings());
  }

  protected toggleBookingStatus(booking: BookingDto): void {
    if (!booking.id) {
      return;
    }

    const updated: BookingDto = {
      ...booking,
      status: booking.status === 'Confirmed' ? 'Pending' : 'Confirmed',
    };

    this.adminApi.updateBooking(booking.id, updated).subscribe(() => this.loadBookings());
  }

  protected deleteBooking(booking: BookingDto): void {
    if (!booking.id) {
      return;
    }

    this.adminApi.deleteBooking(booking.id).subscribe(() => this.loadBookings());
  }
}
