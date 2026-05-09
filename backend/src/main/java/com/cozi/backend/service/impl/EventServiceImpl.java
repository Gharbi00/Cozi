package com.cozi.backend.service.impl;

import com.cozi.backend.dto.EventDto;
import com.cozi.backend.entity.Event;
import com.cozi.backend.entity.Partner;
import com.cozi.backend.entity.User;
import com.cozi.backend.exception.ResourceNotFoundException;
import com.cozi.backend.repository.EventRepository;
import com.cozi.backend.repository.PartnerRepository;
import com.cozi.backend.repository.UserRepository;
import com.cozi.backend.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final PartnerRepository partnerRepository;
    private final UserRepository userRepository;

    public EventServiceImpl(EventRepository eventRepository, PartnerRepository partnerRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.partnerRepository = partnerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public EventDto createEvent(EventDto dto) {
        return mapToDto(eventRepository.save(mapToEntity(dto)));
    }

    @Override
    public Page<EventDto> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public EventDto getEventById(Long id) {
        return mapToDto(eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event", "id", id)));
    }

    @Override
    public EventDto updateEvent(Long id, EventDto dto) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartsAt(dto.getStartsAt());
        event.setEndsAt(dto.getEndsAt());
        if (dto.getPartnerId() != null) {
            Partner partner = partnerRepository.findById(dto.getPartnerId()).orElseThrow(() -> new ResourceNotFoundException("Partner", "id", dto.getPartnerId()));
            event.setPartner(partner);
        }
        return mapToDto(eventRepository.save(event));
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.delete(eventRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event", "id", id)));
    }

    @Override
    public EventDto addParticipant(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        event.getParticipants().add(user);
        return mapToDto(eventRepository.save(event));
    }

    private EventDto mapToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartsAt(event.getStartsAt());
        dto.setEndsAt(event.getEndsAt());
        if (event.getPartner() != null) {
            dto.setPartnerId(event.getPartner().getId());
        }
        return dto;
    }

    private Event mapToEntity(EventDto dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartsAt(dto.getStartsAt());
        event.setEndsAt(dto.getEndsAt());
        if (dto.getPartnerId() != null) {
            Partner partner = partnerRepository.findById(dto.getPartnerId()).orElseThrow(() -> new ResourceNotFoundException("Partner", "id", dto.getPartnerId()));
            event.setPartner(partner);
        }
        return event;
    }
}
