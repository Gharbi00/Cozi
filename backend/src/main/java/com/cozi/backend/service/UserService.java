package com.cozi.backend.service;

import com.cozi.backend.dto.RegisterRequest;
import com.cozi.backend.dto.UserDto;
import com.cozi.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserDto createUser(RegisterRequest request);
    Page<UserDto> getAllUsers(Pageable pageable);
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
    User findByEmail(String email);
}
