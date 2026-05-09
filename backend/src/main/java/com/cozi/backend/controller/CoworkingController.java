package com.cozi.backend.controller;

import com.cozi.backend.dto.CoworkingDto;
import com.cozi.backend.service.CoworkingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coworking")
public class CoworkingController {

    private final CoworkingService coworkingService;

    public CoworkingController(CoworkingService coworkingService) {
        this.coworkingService = coworkingService;
    }

    @GetMapping
    public Page<CoworkingDto> getAll(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return coworkingService.getAllCoworking(pageable);
    }

    @GetMapping("/{id}")
    public CoworkingDto getById(@PathVariable Long id) {
        return coworkingService.getCoworkingById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public CoworkingDto create(@Valid @RequestBody CoworkingDto dto) {
        return coworkingService.createCoworking(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public CoworkingDto update(@PathVariable Long id, @Valid @RequestBody CoworkingDto dto) {
        return coworkingService.updateCoworking(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        coworkingService.deleteCoworking(id);
    }
}
