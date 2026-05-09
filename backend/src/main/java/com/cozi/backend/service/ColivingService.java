package com.cozi.backend.service;

import com.cozi.backend.dto.ColivingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ColivingService {
    ColivingDto createColiving(ColivingDto dto);
    Page<ColivingDto> getAllColiving(Pageable pageable);
    ColivingDto getColivingById(Long id);
    ColivingDto updateColiving(Long id, ColivingDto dto);
    void deleteColiving(Long id);
}
