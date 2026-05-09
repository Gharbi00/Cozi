package com.cozi.backend.service;

import com.cozi.backend.dto.BookingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingDto createBooking(BookingDto dto);
    Page<BookingDto> getAllBookings(Pageable pageable);
    BookingDto getBookingById(Long id);
    BookingDto updateBooking(Long id, BookingDto dto);
    void deleteBooking(Long id);
    Page<BookingDto> getBookingsByUser(Long userId, Pageable pageable);
}
