package com.cozi.backend.dto;

import com.cozi.backend.entity.BookingType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingDto {
    private Long id;
    @NotNull
    private Long userId;
    private Long coworkingId;
    private Long colivingId;
    @NotNull
    private BookingType bookingType;
    private LocalDate startDate;
    private LocalDate endDate;
    private double totalPrice;
    private String status;

    public BookingDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCoworkingId() {
        return coworkingId;
    }

    public void setCoworkingId(Long coworkingId) {
        this.coworkingId = coworkingId;
    }

    public Long getColivingId() {
        return colivingId;
    }

    public void setColivingId(Long colivingId) {
        this.colivingId = colivingId;
    }

    public BookingType getBookingType() {
        return bookingType;
    }

    public void setBookingType(BookingType bookingType) {
        this.bookingType = bookingType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
