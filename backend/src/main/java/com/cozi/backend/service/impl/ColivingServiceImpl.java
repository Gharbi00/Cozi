package com.cozi.backend.service.impl;

import com.cozi.backend.dto.ColivingDto;
import com.cozi.backend.entity.Coliving;
import com.cozi.backend.exception.ResourceNotFoundException;
import com.cozi.backend.repository.ColivingRepository;
import com.cozi.backend.service.ColivingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ColivingServiceImpl implements ColivingService {

    private final ColivingRepository colivingRepository;

    public ColivingServiceImpl(ColivingRepository colivingRepository) {
        this.colivingRepository = colivingRepository;
    }

    @Override
    public ColivingDto createColiving(ColivingDto dto) {
        return mapToDto(colivingRepository.save(mapToEntity(dto)));
    }

    @Override
    public Page<ColivingDto> getAllColiving(Pageable pageable) {
        return colivingRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public ColivingDto getColivingById(Long id) {
        return mapToDto(colivingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coliving", "id", id)));
    }

    @Override
    public ColivingDto updateColiving(Long id, ColivingDto dto) {
        Coliving entity = colivingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coliving", "id", id));
        entity.setName(dto.getName());
        entity.setLocation(dto.getLocation());
        entity.setRooms(dto.getRooms());
        entity.setAvailable(dto.isAvailable());
        entity.setDescription(dto.getDescription());
        return mapToDto(colivingRepository.save(entity));
    }

    @Override
    public void deleteColiving(Long id) {
        colivingRepository.delete(colivingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coliving", "id", id)));
    }

    private ColivingDto mapToDto(Coliving entity) {
        ColivingDto dto = new ColivingDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLocation(entity.getLocation());
        dto.setRooms(entity.getRooms());
        dto.setAvailable(entity.isAvailable());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private Coliving mapToEntity(ColivingDto dto) {
        Coliving entity = new Coliving();
        entity.setName(dto.getName());
        entity.setLocation(dto.getLocation());
        entity.setRooms(dto.getRooms());
        entity.setAvailable(dto.isAvailable());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
