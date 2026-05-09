package com.cozi.backend.service.impl;

import com.cozi.backend.dto.CoworkingDto;
import com.cozi.backend.entity.Coworking;
import com.cozi.backend.exception.ResourceNotFoundException;
import com.cozi.backend.repository.CoworkingRepository;
import com.cozi.backend.service.CoworkingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CoworkingServiceImpl implements CoworkingService {

    private final CoworkingRepository coworkingRepository;

    public CoworkingServiceImpl(CoworkingRepository coworkingRepository) {
        this.coworkingRepository = coworkingRepository;
    }

    @Override
    public CoworkingDto createCoworking(CoworkingDto dto) {
        return mapToDto(coworkingRepository.save(mapToEntity(dto)));
    }

    @Override
    public Page<CoworkingDto> getAllCoworking(Pageable pageable) {
        return coworkingRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public CoworkingDto getCoworkingById(Long id) {
        return mapToDto(coworkingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coworking", "id", id)));
    }

    @Override
    public CoworkingDto updateCoworking(Long id, CoworkingDto dto) {
        Coworking entity = coworkingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coworking", "id", id));
        entity.setName(dto.getName());
        entity.setLocation(dto.getLocation());
        entity.setCapacity(dto.getCapacity());
        entity.setAvailable(dto.isAvailable());
        entity.setDescription(dto.getDescription());
        return mapToDto(coworkingRepository.save(entity));
    }

    @Override
    public void deleteCoworking(Long id) {
        coworkingRepository.delete(coworkingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coworking", "id", id)));
    }

    private CoworkingDto mapToDto(Coworking entity) {
        CoworkingDto dto = new CoworkingDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLocation(entity.getLocation());
        dto.setCapacity(entity.getCapacity());
        dto.setAvailable(entity.isAvailable());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private Coworking mapToEntity(CoworkingDto dto) {
        Coworking entity = new Coworking();
        entity.setName(dto.getName());
        entity.setLocation(dto.getLocation());
        entity.setCapacity(dto.getCapacity());
        entity.setAvailable(dto.isAvailable());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
