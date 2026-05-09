package com.cozi.backend.repository;

import com.cozi.backend.entity.Coworking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoworkingRepository extends JpaRepository<Coworking, Long> {
}
