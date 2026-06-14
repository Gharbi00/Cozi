package com.cozi.backend.controller;

import com.cozi.backend.dto.BookingDto;
import com.cozi.backend.entity.BookingType;
import com.cozi.backend.config.JwtUtils;
import com.cozi.backend.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
@AutoConfigureMockMvc(addFilters = false)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    void createBooking_returnsConfirmedBooking() throws Exception {
        BookingDto request = new BookingDto();
        request.setUserId(1L);
        request.setBookingType(BookingType.COWORKING);
        request.setCoworkingId(1L);
        request.setStartDate(LocalDate.of(2026, 1, 1));
        request.setEndDate(LocalDate.of(2026, 1, 2));
        request.setTotalPrice(120.0);
        request.setStatus("PENDING");

        BookingDto response = new BookingDto();
        response.setId(10L);
        response.setUserId(1L);
        response.setBookingType(BookingType.COWORKING);
        response.setCoworkingId(1L);
        response.setStartDate(request.getStartDate());
        response.setEndDate(request.getEndDate());
        response.setTotalPrice(120.0);
        response.setStatus("CONFIRMED");

        when(bookingService.createBooking(any(BookingDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));

        verify(bookingService).createBooking(any(BookingDto.class));
    }

    @Test
    void getBookingById_returnsBooking() throws Exception {
        BookingDto response = new BookingDto();
        response.setId(11L);
        response.setUserId(1L);
        response.setBookingType(BookingType.COWORKING);
        response.setCoworkingId(1L);
        response.setStartDate(LocalDate.of(2026, 2, 1));
        response.setEndDate(LocalDate.of(2026, 2, 2));
        response.setTotalPrice(80.0);
        response.setStatus("CONFIRMED");

        when(bookingService.getBookingById(11L)).thenReturn(response);

        mockMvc.perform(get("/api/bookings/11")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }
}
