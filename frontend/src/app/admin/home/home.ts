import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../shared/services/admin-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected readonly overviewCards = [
    { title: 'Coliving units', value: '0', detail: 'Loading …' },
    { title: 'Coworking seats', value: '0', detail: 'Loading …' },
    { title: 'Monthly revenue', value: '$31,400', detail: '+12% from last month' },
    { title: 'New leads', value: '74', detail: '24 in the last 7 days' },
  ];

  protected readonly progressItems = [
    { title: 'Coliving occupancy', value: '0%', progress: 0, variant: 'bg-success' },
    { title: 'Coworking utilization', value: '74%', progress: 74, variant: 'bg-info' },
    { title: 'Average stay', value: '28 nights', progress: 70, variant: 'bg-primary' },
  ];

  protected latestActivity: Array<{ type: string; detail: string; time: string }> = [];
  protected isLoading = false;

  constructor(@Inject(AdminApiService) private readonly adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected refresh(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;

    this.adminApi.getColiving().subscribe((colivingPage) => {
      this.overviewCards[0].value = `${colivingPage.content.length}`;
      this.overviewCards[0].detail = `${colivingPage.content.length} active spaces`;
    });

    this.adminApi.getCoworking().subscribe((coworkingPage) => {
      this.overviewCards[1].value = `${coworkingPage.content.length}`;
      this.overviewCards[1].detail = `${coworkingPage.content.length} active desks`;
    });

    this.adminApi.getBookings().subscribe((bookingPage) => {
      const bookings = bookingPage.content || [];

      this.latestActivity = bookings.slice(0, 3).map((booking) => ({
        type: booking.bookingType === 'COLIVING' ? 'Coliving booking' : 'Coworking reservation',
        detail:
          booking.bookingType === 'COLIVING'
            ? `Unit ${booking.colivingId ?? 'TBD'} reserved`
            : `Desk ${booking.coworkingId ?? 'TBD'} reserved`,
        time: booking.startDate ?? booking.endDate ?? 'Just now',
      }));

      const colivingCount = bookings.filter((booking) => booking.bookingType === 'COLIVING').length;
      this.progressItems[0].value = `${Math.min(100, colivingCount * 12)}%`;
      this.progressItems[0].progress = Math.min(100, colivingCount * 12);
      this.isLoading = false;
    });
  }
}
