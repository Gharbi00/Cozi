package com.cozi.backend.controller;

import com.cozi.backend.dto.PartnerDto;
import com.cozi.backend.service.PartnerService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping
    public Page<PartnerDto> getAll(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return partnerService.getAllPartners(pageable);
    }

    @GetMapping("/{id}")
    public PartnerDto getById(@PathVariable Long id) {
        return partnerService.getPartnerById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public PartnerDto create(@Valid @RequestBody PartnerDto dto) {
        return partnerService.createPartner(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public PartnerDto update(@PathVariable Long id, @Valid @RequestBody PartnerDto dto) {
        return partnerService.updatePartner(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        partnerService.deletePartner(id);
    }
}
