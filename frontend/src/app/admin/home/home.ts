import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly overviewCards = [
    { title: 'Coliving units', value: '42', detail: '32 occupied, 10 available' },
    { title: 'Coworking seats', value: '120', detail: '88 reserved, 32 free' },
    { title: 'Monthly revenue', value: '$31,400', detail: '+12% from last month' },
    { title: 'New leads', value: '74', detail: '24 in the last 7 days' },
  ];

  protected readonly progressItems = [
    { title: 'Coliving occupancy', value: '86%', progress: 86, variant: 'bg-success' },
    { title: 'Coworking utilization', value: '74%', progress: 74, variant: 'bg-info' },
    { title: 'Average stay', value: '28 nights', progress: 70, variant: 'bg-primary' },
  ];

  protected readonly latestActivity = [
    { type: 'New coliving booking', detail: 'Suite 4 reserved', time: '12 min ago' },
    { type: 'Coworking plan renewed', detail: 'Team desk plan extended', time: '1h ago' },
    { type: 'Payment received', detail: '$1,240 for coliving', time: '3h ago' },
  ];
}
