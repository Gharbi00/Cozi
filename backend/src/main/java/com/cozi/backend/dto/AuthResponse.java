package com.cozi.backend.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private List<String> roles;
    private Long userId;

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse(String token, List<String> roles) {
        this.token = token;
        this.roles = roles;
        this.userId = null;
    }

    public AuthResponse(String token, List<String> roles, Long userId) {
        this.token = token;
        this.roles = roles;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
