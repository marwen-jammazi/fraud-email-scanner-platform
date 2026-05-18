package com.fraudscanner.authservice.dto;

import com.fraudscanner.authservice.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private boolean active;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
}
