import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './shared/layout/header/header';
import { Footer } from './shared/layout/footer/footer';
import Aos from 'aos';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Coziways');
  protected readonly isAdmin = signal(false);

  constructor(private readonly router: Router) {
    this.isAdmin.set(this.router.url.startsWith('/admin'));
  }

  ngOnInit(): void {
    Aos.init();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.isAdmin.set(event.urlAfterRedirects.startsWith('/admin'));
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
}
