import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coworking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './coworking.html',
  styleUrl: './coworking.scss',
})
export class Coworking {
  protected readonly stats = [
    { label: 'Desk capacity', value: '120', progress: 92, variant: 'bg-success' },
    { label: 'Active members', value: '96', progress: 80, variant: 'bg-info' },
    { label: 'Weekly revenue', value: '$9,560', progress: 76, variant: 'bg-primary' },
    { label: 'Meeting room use', value: '39%', progress: 39, variant: 'bg-warning' },
  ];

  protected readonly reservations = [
    { client: 'Iyed Hammami', desk: 'Hot desk 8', date: '05/04/2026', hours: '5', status: 'Confirmed' },
    { client: 'Amel Khadri', desk: 'Private cabin', date: '05/09/2026', hours: '8', status: 'Pending' },
    { client: 'Wassim J.', desk: 'Team desk 2', date: '05/15/2026', hours: '3', status: 'Confirmed' },
  ];

  protected readonly membership = [
    { title: 'Daily passes', value: '24 sold' },
    { title: 'Monthly plans', value: '12 active' },
    { title: 'Conference bookings', value: '6 this month' },
  ];
}
