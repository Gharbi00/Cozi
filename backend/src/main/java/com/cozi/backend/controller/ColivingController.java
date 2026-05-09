package com.cozi.backend.controller;

import com.cozi.backend.dto.ColivingDto;
import com.cozi.backend.service.ColivingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coliving")
public class ColivingController {

    private final ColivingService colivingService;

    public ColivingController(ColivingService colivingService) {
        this.colivingService = colivingService;
    }

    @GetMapping
    public Page<ColivingDto> getAll(@RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return colivingService.getAllColiving(pageable);
    }

    @GetMapping("/{id}")
    public ColivingDto getById(@PathVariable Long id) {
        return colivingService.getColivingById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ColivingDto create(@Valid @RequestBody ColivingDto dto) {
        return colivingService.createColiving(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ColivingDto update(@PathVariable Long id, @Valid @RequestBody ColivingDto dto) {
        return colivingService.updateColiving(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        colivingService.deleteColiving(id);
    }
}
