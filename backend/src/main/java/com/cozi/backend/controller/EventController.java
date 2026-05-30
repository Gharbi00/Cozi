package com.cozi.backend.controller;

import com.cozi.backend.dto.EventDto;
import com.cozi.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public Page<EventDto> getAll(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventService.getAllEvents(pageable);
    }

    @GetMapping("/{id}")
    public EventDto getById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public EventDto create(@Valid @RequestBody EventDto dto) {
        return eventService.createEvent(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public EventDto update(@PathVariable Long id, @Valid @RequestBody EventDto dto) {
        return eventService.updateEvent(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    @PostMapping("/{id}/participants")
    public EventDto addParticipant(@PathVariable Long id, @RequestParam Long userId) {
        return eventService.addParticipant(id, userId);
    }

    @GetMapping("/{id}/participants")
    public java.util.List<Long> getParticipants(@PathVariable Long id) {
        return eventService.getParticipantIds(id);
    }
}
