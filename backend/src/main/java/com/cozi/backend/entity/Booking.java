package com.cozi.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coworking_id")
    private Coworking coworking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coliving_id")
    private Coliving coliving;

    @Enumerated(EnumType.STRING)
    @NotNull
    private BookingType bookingType;

    private LocalDate startDate;
    private LocalDate endDate;

    private double totalPrice;

    private String status;

    public Booking() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Coworking getCoworking() {
        return coworking;
    }

    public void setCoworking(Coworking coworking) {
        this.coworking = coworking;
    }

    public Coliving getColiving() {
        return coliving;
    }

    public void setColiving(Coliving coliving) {
        this.coliving = coliving;
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
