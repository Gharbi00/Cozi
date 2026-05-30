package com.cozi.backend.service;

import com.cozi.backend.dto.EventDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventService {
    EventDto createEvent(EventDto dto);
    Page<EventDto> getAllEvents(Pageable pageable);
    EventDto getEventById(Long id);
    EventDto updateEvent(Long id, EventDto dto);
    void deleteEvent(Long id);
    EventDto addParticipant(Long eventId, Long userId);
    List<Long> getParticipantIds(Long eventId);
}
