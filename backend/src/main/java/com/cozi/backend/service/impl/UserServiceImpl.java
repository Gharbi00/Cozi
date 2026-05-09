package com.cozi.backend.service.impl;

import com.cozi.backend.dto.RegisterRequest;
import com.cozi.backend.dto.UserDto;
import com.cozi.backend.entity.Role;
import com.cozi.backend.entity.User;
import com.cozi.backend.exception.BusinessException;
import com.cozi.backend.exception.ResourceNotFoundException;
import com.cozi.backend.repository.UserRepository;
import com.cozi.backend.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDto createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Set<Role> roles = request.getRoles() == null || request.getRoles().isEmpty()
                ? Set.of(Role.CUSTOMER)
                : new HashSet<>(request.getRoles());
        user.setRoles(roles);
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Override
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public UserDto getUserById(Long id) {
        return mapToDto(userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id)));
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        if (userDto.getRoles() != null) {
            user.setRoles(userDto.getRoles());
        }
        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles());
        return dto;
    }
}
