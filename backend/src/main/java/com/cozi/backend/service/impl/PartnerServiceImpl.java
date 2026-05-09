package com.cozi.backend.service.impl;

import com.cozi.backend.dto.PartnerDto;
import com.cozi.backend.entity.Partner;
import com.cozi.backend.exception.ResourceNotFoundException;
import com.cozi.backend.repository.PartnerRepository;
import com.cozi.backend.service.PartnerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private final PartnerRepository partnerRepository;

    public PartnerServiceImpl(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Override
    public PartnerDto createPartner(PartnerDto dto) {
        return mapToDto(partnerRepository.save(mapToEntity(dto)));
    }

    @Override
    public Page<PartnerDto> getAllPartners(Pageable pageable) {
        return partnerRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public PartnerDto getPartnerById(Long id) {
        return mapToDto(partnerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Partner", "id", id)));
    }

    @Override
    public PartnerDto updatePartner(Long id, PartnerDto dto) {
        Partner entity = partnerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Partner", "id", id));
        entity.setName(dto.getName());
        entity.setWebsite(dto.getWebsite());
        entity.setDescription(dto.getDescription());
        return mapToDto(partnerRepository.save(entity));
    }

    @Override
    public void deletePartner(Long id) {
        partnerRepository.delete(partnerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Partner", "id", id)));
    }

    private PartnerDto mapToDto(Partner entity) {
        PartnerDto dto = new PartnerDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setWebsite(entity.getWebsite());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private Partner mapToEntity(PartnerDto dto) {
        Partner entity = new Partner();
        entity.setName(dto.getName());
        entity.setWebsite(dto.getWebsite());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
