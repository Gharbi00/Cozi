package com.cozi.backend.service;

import com.cozi.backend.dto.BookingDto;
import com.cozi.backend.entity.Booking;
import com.cozi.backend.entity.BookingType;
import com.cozi.backend.entity.Coworking;
import com.cozi.backend.entity.User;
import com.cozi.backend.exception.BusinessException;
import com.cozi.backend.repository.BookingRepository;
import com.cozi.backend.repository.ColivingRepository;
import com.cozi.backend.repository.CoworkingRepository;
import com.cozi.backend.repository.UserRepository;
import com.cozi.backend.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CoworkingRepository coworkingRepository;

    @Mock
    private ColivingRepository colivingRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    @Test
    void createBooking_whenCoworkingIsAvailable_returnsConfirmedBooking() {
        User user = new User();
        user.setId(1L);

        Coworking coworking = new Coworking();
        coworking.setId(2L);
        coworking.setAvailable(true);

        BookingDto request = new BookingDto();
        request.setUserId(1L);
        request.setBookingType(BookingType.COWORKING);
        request.setCoworkingId(2L);
        request.setStartDate(LocalDate.of(2026, 1, 1));
        request.setEndDate(LocalDate.of(2026, 1, 2));
        request.setTotalPrice(150.0);
        request.setStatus("PENDING");

        Booking saved = new Booking();
        saved.setId(5L);
        saved.setUser(user);
        saved.setCoworking(coworking);
        saved.setBookingType(BookingType.COWORKING);
        saved.setStartDate(request.getStartDate());
        saved.setEndDate(request.getEndDate());
        saved.setTotalPrice(150.0);
        saved.setStatus("CONFIRMED");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(coworkingRepository.findById(2L)).thenReturn(Optional.of(coworking));
        when(bookingRepository.findByCoworkingIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                2L, request.getEndDate(), request.getStartDate())).thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenReturn(saved);

        BookingDto result = bookingService.createBooking(request);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(5L);
        assertThat(result.getStatus()).isEqualTo("CONFIRMED");
        assertThat(result.getCoworkingId()).isEqualTo(2L);
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_whenEndDateBeforeStartDate_throwsBusinessException() {
        User user = new User();
        user.setId(1L);

        Coworking coworking = new Coworking();
        coworking.setId(2L);
        coworking.setAvailable(true);

        BookingDto request = new BookingDto();
        request.setUserId(1L);
        request.setBookingType(BookingType.COWORKING);
        request.setCoworkingId(2L);
        request.setStartDate(LocalDate.of(2026, 1, 5));
        request.setEndDate(LocalDate.of(2026, 1, 1));
        request.setTotalPrice(150.0);
        request.setStatus("PENDING");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(coworkingRepository.findById(2L)).thenReturn(Optional.of(coworking));

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Booking dates are invalid");
    }
}
