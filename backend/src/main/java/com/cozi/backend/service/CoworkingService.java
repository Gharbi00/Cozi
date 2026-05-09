package com.cozi.backend.service;

import com.cozi.backend.dto.CoworkingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CoworkingService {
    CoworkingDto createCoworking(CoworkingDto dto);
    Page<CoworkingDto> getAllCoworking(Pageable pageable);
    CoworkingDto getCoworkingById(Long id);
    CoworkingDto updateCoworking(Long id, CoworkingDto dto);
    void deleteCoworking(Long id);
}
