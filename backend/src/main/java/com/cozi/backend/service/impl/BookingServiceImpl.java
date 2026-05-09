package com.cozi.backend.service.impl;

import com.cozi.backend.dto.BookingDto;
import com.cozi.backend.entity.Booking;
import com.cozi.backend.entity.BookingType;
import com.cozi.backend.entity.Coliving;
import com.cozi.backend.entity.Coworking;
import com.cozi.backend.entity.User;
import com.cozi.backend.exception.BusinessException;
import com.cozi.backend.exception.ResourceNotFoundException;
import com.cozi.backend.repository.BookingRepository;
import com.cozi.backend.repository.ColivingRepository;
import com.cozi.backend.repository.CoworkingRepository;
import com.cozi.backend.repository.UserRepository;
import com.cozi.backend.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CoworkingRepository coworkingRepository;
    private final ColivingRepository colivingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, UserRepository userRepository, CoworkingRepository coworkingRepository, ColivingRepository colivingRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.coworkingRepository = coworkingRepository;
        this.colivingRepository = colivingRepository;
    }

    @Override
    public BookingDto createBooking(BookingDto dto) {
        Booking booking = mapToEntity(dto);
        validateAvailability(booking);
        booking.setStatus("CONFIRMED");
        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public Page<BookingDto> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public BookingDto getBookingById(Long id) {
        return mapToDto(bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id)));
    }

    @Override
    public BookingDto updateBooking(Long id, BookingDto dto) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
        booking.setStartDate(dto.getStartDate());
        booking.setEndDate(dto.getEndDate());
        booking.setTotalPrice(dto.getTotalPrice());
        booking.setStatus(dto.getStatus());
        validateAvailability(booking);
        return mapToDto(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(Long id) {
        bookingRepository.delete(bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id)));
    }

    @Override
    public Page<BookingDto> getBookingsByUser(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable).map(this::mapToDto);
    }

    private BookingDto mapToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setCoworkingId(booking.getCoworking() != null ? booking.getCoworking().getId() : null);
        dto.setColivingId(booking.getColiving() != null ? booking.getColiving().getId() : null);
        dto.setBookingType(booking.getBookingType());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        return dto;
    }

    private Booking mapToEntity(BookingDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getUserId()));
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setBookingType(dto.getBookingType());
        booking.setStartDate(dto.getStartDate());
        booking.setEndDate(dto.getEndDate());
        booking.setTotalPrice(dto.getTotalPrice());
        booking.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");
        if (dto.getBookingType() == BookingType.COWORKING) {
            Coworking coworking = coworkingRepository.findById(dto.getCoworkingId()).orElseThrow(() -> new ResourceNotFoundException("Coworking", "id", dto.getCoworkingId()));
            booking.setCoworking(coworking);
        } else if (dto.getBookingType() == BookingType.COLIVING) {
            Coliving coliving = colivingRepository.findById(dto.getColivingId()).orElseThrow(() -> new ResourceNotFoundException("Coliving", "id", dto.getColivingId()));
            booking.setColiving(coliving);
        }
        return booking;
    }

    private void validateAvailability(Booking booking) {
        LocalDate start = booking.getStartDate();
        LocalDate end = booking.getEndDate();
        if (start == null || end == null || end.isBefore(start)) {
            throw new BusinessException("Booking dates are invalid");
        }
        if (booking.getBookingType() == BookingType.COWORKING && booking.getCoworking() != null) {
            if (!booking.getCoworking().isAvailable()) {
                throw new BusinessException("Coworking space is not available");
            }
            boolean overlap = !bookingRepository.findByCoworkingIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                    booking.getCoworking().getId(), end, start).isEmpty();
            if (overlap) {
                throw new BusinessException("Coworking space is already booked for this period");
            }
        }
        if (booking.getBookingType() == BookingType.COLIVING && booking.getColiving() != null) {
            if (!booking.getColiving().isAvailable()) {
                throw new BusinessException("Coliving space is not available");
            }
            boolean overlap = !bookingRepository.findByColivingIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                    booking.getColiving().getId(), end, start).isEmpty();
            if (overlap) {
                throw new BusinessException("Coliving space is already booked for this period");
            }
        }
    }
}
