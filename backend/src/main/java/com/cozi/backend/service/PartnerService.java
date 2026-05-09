package com.cozi.backend.service;

import com.cozi.backend.dto.PartnerDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PartnerService {
    PartnerDto createPartner(PartnerDto dto);
    Page<PartnerDto> getAllPartners(Pageable pageable);
    PartnerDto getPartnerById(Long id);
    PartnerDto updatePartner(Long id, PartnerDto dto);
    void deletePartner(Long id);
}
