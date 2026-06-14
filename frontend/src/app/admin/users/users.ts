import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, UserDto, BookingDto, EventDto } from '../../shared/services/admin-api.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

type UserFormState = Partial<Omit<UserDto, 'roles'> & { password?: string; roles?: string | string[] }>;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users implements OnInit {
  users: UserDto[] = [];
  loading = false;
  error: string | null = null;
  page = 0;

  showForm = false;
  isEditing = false;
  form: UserFormState = {};

  expandedUserId: number | null = null;
  colivingBookings: BookingDto[] = [];
  coworkingBookings: BookingDto[] = [];
  eventParticipations: EventDto[] = [];

  constructor(@Inject(AdminApiService) private readonly adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.adminApi.getUsers(this.page).subscribe({
      next: (page) => {
        this.users = page.content || [];
        this.loading = false;
        console.debug('Loaded users', this.users);
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 403) {
          this.error = 'Access denied: you must be an ADMIN user to view the full user list.';
        } else {
          this.error = 'Failed to load users. Check the backend or your auth token.';
        }
        console.error('Failed to load users', err);
        Swal.fire({
          icon: 'error',
          title: 'Unable to load users',
          text: this.error,
        });
      },
    });
  }

  startAdd(): void {
    this.showForm = true;
    this.isEditing = false;
    this.form = {};
  }

  startEdit(user: UserDto): void {
    this.showForm = true;
    this.isEditing = true;
    this.form = {
      ...user,
      roles: user.roles ? [...(user.roles as string[])] : [],
    };
  }

  cancelForm(): void {
    this.showForm = false;
    this.form = {};
  }

  save(): void {
    const payload = {
      firstName: this.form.firstName || '',
      lastName: this.form.lastName || '',
      email: this.form.email || '',
    } as any;

    if (this.form.roles != null) {
      if (Array.isArray(this.form.roles)) {
        const parsedRoles = (this.form.roles as string[]).filter(Boolean);
        if (parsedRoles.length > 0) {
          payload.roles = parsedRoles;
        }
      } else if (typeof this.form.roles === 'string') {
        const parsedRoles = (this.form.roles as string)
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean);
        if (parsedRoles.length > 0) {
          payload.roles = parsedRoles;
        }
      }
    }

    if (this.isEditing && this.form.id) {
      this.adminApi.updateUser(this.form.id, payload).subscribe(() => {
        this.showForm = false;
        this.loadUsers();
        Swal.fire({
          icon: 'success',
          title: 'User updated',
          text: 'User details have been saved successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      });
      return;
    }

    // create via register endpoint requires password
    payload.password = this.form.password || 'changeme';
    if (!payload.roles) {
      payload.roles = ['CUSTOMER'];
    }

    this.adminApi.createUser(payload).subscribe(() => {
      this.showForm = false;
      this.loadUsers();
      Swal.fire({
        icon: 'success',
        title: 'User created',
        text: 'New user was added successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    });
  }

  deleteUser(user: UserDto): void {
    if (!user.id) return;
    Swal.fire({
      title: `Delete user ${user.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.adminApi.deleteUser(user.id!).subscribe({
        next: () => {
          this.loadUsers();
          Swal.fire({
            icon: 'success',
            title: 'User deleted',
            text: 'The user has been removed.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          console.error('Delete user failed', err);
          Swal.fire({
            icon: 'error',
            title: 'Delete failed',
            text: 'Unable to delete user. Please try again.',
          });
        },
      });
    });
  }

  toggleRow(user: UserDto): void {
    if (!user.id) return;
    if (this.expandedUserId === user.id) {
      this.expandedUserId = null;
      return;
    }
    this.expandedUserId = user.id;
    // load bookings and events
    this.adminApi.getBookingsByUser(user.id).subscribe((bpage) => {
      const all = bpage.content || [];
      this.colivingBookings = all.filter((b) => b.bookingType === 'COLIVING');
      this.coworkingBookings = all.filter((b) => b.bookingType === 'COWORKING');
    });

    this.adminApi.getEvents().subscribe((epage) => {
      const events = epage.content || [];
      this.eventParticipations = events.filter((e) => (e.participantIds || []).includes(user.id!));
    });
  }
}
