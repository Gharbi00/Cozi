package com.cozi.backend.controller;

import com.cozi.backend.dto.BookingDto;
import com.cozi.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public Page<BookingDto> getAll(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingService.getAllBookings(pageable);
    }

    @GetMapping("/{id}")
    public BookingDto getById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public Page<BookingDto> getByUser(@PathVariable Long userId,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingService.getBookingsByUser(userId, pageable);
    }

    @PostMapping
    public BookingDto create(@Valid @RequestBody BookingDto dto) {
        return bookingService.createBooking(dto);
    }

    @PutMapping("/{id}")
    public BookingDto update(@PathVariable Long id, @Valid @RequestBody BookingDto dto) {
        return bookingService.updateBooking(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public void delete(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
}
