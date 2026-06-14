import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PagedResponse<T> {
  content: T[];
  pageable?: unknown;
  totalElements?: number;
  totalPages?: number;
  number?: number;
}

export interface BookingDto {
  id?: number;
  userId?: number;
  coworkingId?: number;
  colivingId?: number;
  bookingType: 'COWORKING' | 'COLIVING';
  startDate: string;
  endDate: string;
  totalPrice: number;
  notes?: string;
  status?: string;
}

export interface ColivingDto {
  id?: number;
  name?: string;
  units?: number;
  location?: string;
}

export interface CoworkingDto {
  id?: number;
  name?: string;
  desks?: number;
  location?: string;
}

export interface UserDto {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
}

export interface EventDto {
  id?: number;
  title?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  partnerId?: number;
  participantIds?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  getBookings(page = 0, size = 20): Observable<PagedResponse<BookingDto>> {
    return this.http.get<PagedResponse<BookingDto>>(`${this.apiUrl}/bookings?page=${page}&size=${size}`);
  }

  getBookingsByUser(userId: number, page = 0, size = 50): Observable<PagedResponse<BookingDto>> {
    return this.http.get<PagedResponse<BookingDto>>(`${this.apiUrl}/bookings/user/${userId}?page=${page}&size=${size}`);
  }

  createBooking(booking: BookingDto) {
    return this.http.post<BookingDto>(`${this.apiUrl}/bookings`, booking);
  }

  updateBooking(id: number, booking: BookingDto) {
    return this.http.put<BookingDto>(`${this.apiUrl}/bookings/${id}`, booking);
  }

  deleteBooking(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${id}`);
  }

  getColiving(page = 0, size = 20): Observable<PagedResponse<ColivingDto>> {
    return this.http.get<PagedResponse<ColivingDto>>(`${this.apiUrl}/coliving?page=${page}&size=${size}`);
  }

  createColiving(item: ColivingDto) {
    return this.http.post<ColivingDto>(`${this.apiUrl}/coliving`, item);
  }

  updateColiving(id: number, item: ColivingDto) {
    return this.http.put<ColivingDto>(`${this.apiUrl}/coliving/${id}`, item);
  }

  deleteColiving(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/coliving/${id}`);
  }

  getCoworking(page = 0, size = 20): Observable<PagedResponse<CoworkingDto>> {
    return this.http.get<PagedResponse<CoworkingDto>>(`${this.apiUrl}/coworking?page=${page}&size=${size}`);
  }

  createCoworking(item: CoworkingDto) {
    return this.http.post<CoworkingDto>(`${this.apiUrl}/coworking`, item);
  }

  updateCoworking(id: number, item: CoworkingDto) {
    return this.http.put<CoworkingDto>(`${this.apiUrl}/coworking/${id}`, item);
  }

  deleteCoworking(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/coworking/${id}`);
  }

  // Users
  getUsers(page = 0, size = 50): Observable<PagedResponse<UserDto>> {
    return this.http.get<PagedResponse<UserDto>>(`${this.apiUrl}/users?page=${page}&size=${size}`);
  }

  getUser(id: number) {
    return this.http.get<UserDto>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: number, user: UserDto) {
    return this.http.put<UserDto>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Create user via auth register endpoint
  createUser(registerPayload: { firstName: string; lastName: string; email: string; password: string; roles?: string[] }) {
    return this.http.post<UserDto>(`${this.apiUrl}/auth/register`, registerPayload);
  }

  // Events
  getEvents(page = 0, size = 100) {
    return this.http.get<PagedResponse<EventDto>>(`${this.apiUrl}/events?page=${page}&size=${size}`);
  }
}
