import { Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
    { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
    { path: 'blog', loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog) },
    { path: 'blog/:id', loadComponent: () => import('./pages/blog/blog-details/blog-details').then((m) => m.BlogDetails) },
    { path: 'locations', loadComponent: () => import('./pages/locations/locations').then((m) => m.Locations) },
    { path: 'locations/:id', loadComponent: () => import('./pages/locations/location-details/location-details').then((m) => m.LocationDetails) },
    { path: 'coliving', loadComponent: () => import('./pages/coliving/coliving').then((m) => m.Coliving) },
    { path: 'coworking', loadComponent: () => import('./pages/coworking/coworking').then((m) => m.Coworking) },
    { path: 'admin', loadComponent: () => import('./admin/home/home').then((m) => m.Home), canActivate: [AdminGuard] },
    { path: 'admin/coliving', loadComponent: () => import('./admin/coliving/coliving').then((m) => m.Coliving), canActivate: [AdminGuard] },
    { path: 'admin/coworking', loadComponent: () => import('./admin/coworking/coworking').then((m) => m.Coworking), canActivate: [AdminGuard] },
    { path: 'admin/users', loadComponent: () => import('./admin/users/users').then((m) => m.Users), canActivate: [AdminGuard] },
    { path: 'experiences', loadComponent: () => import('./pages/experiences/experiences').then((m) => m.Experiences) },
    { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
    { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
