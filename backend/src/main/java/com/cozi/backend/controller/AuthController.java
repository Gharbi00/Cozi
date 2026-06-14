package com.cozi.backend.controller;

import com.cozi.backend.config.JwtUtils;
import com.cozi.backend.dto.AuthRequest;
import com.cozi.backend.dto.AuthResponse;
import com.cozi.backend.dto.RegisterRequest;
import com.cozi.backend.entity.User;
import com.cozi.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        var principal = authentication.getPrincipal();
        String email = authentication.getName();
        List<String> roles = authentication.getAuthorities().stream()
            .map(a -> a.getAuthority().replace("ROLE_", ""))
            .collect(Collectors.toList());
        String token = jwtUtils.generateToken(email, roles);
        var user = userService.findByEmail(loginRequest.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, roles, user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (registerRequest.getRoles() == null || registerRequest.getRoles().isEmpty()) {
            registerRequest.setRoles(java.util.Set.of(com.cozi.backend.entity.Role.CUSTOMER));
        }
        var userDto = userService.createUser(registerRequest);
        return ResponseEntity.ok(userDto);
    }
}
