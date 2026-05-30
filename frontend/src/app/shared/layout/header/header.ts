import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, Auth],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
