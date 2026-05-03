import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coliving',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './coliving.html',
  styleUrl: './coliving.scss',
})
export class Coliving {
  protected readonly stats = [
    { label: 'Current occupancy', value: '86%', progress: 86, variant: 'bg-success' },
    { label: 'Available units', value: '6', progress: 23, variant: 'bg-warning' },
    { label: 'Monthly revenue', value: '$16,800', progress: 84, variant: 'bg-info' },
    { label: 'Average stay', value: '28 nights', progress: 70, variant: 'bg-primary' },
  ];

  protected readonly bookings = [
    { guest: 'Sara Ahmed', unit: 'Suite 4', checkIn: '05/02/2026', nights: '12', status: 'Confirmed' },
    { guest: 'Fares Ben Ali', unit: 'Suite 7', checkIn: '05/10/2026', nights: '9', status: 'Pending' },
    { guest: 'Mariam Gharbi', unit: 'Suite 2', checkIn: '05/16/2026', nights: '14', status: 'Confirmed' },
  ];

  protected readonly facilityMetrics = [
    { title: 'Private rooms', value: '18/20 available' },
    { title: 'Shared kitchen bookings', value: '42 this month' },
    { title: 'Community events', value: '8 scheduled' },
  ];
}
