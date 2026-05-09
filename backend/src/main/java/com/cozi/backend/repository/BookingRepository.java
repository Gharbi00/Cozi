package com.cozi.backend.repository;

import com.cozi.backend.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByUserId(Long userId, Pageable pageable);
    List<Booking> findByCoworkingIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Long coworkingId, LocalDate end, LocalDate start);
    List<Booking> findByColivingIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Long colivingId, LocalDate end, LocalDate start);
}
