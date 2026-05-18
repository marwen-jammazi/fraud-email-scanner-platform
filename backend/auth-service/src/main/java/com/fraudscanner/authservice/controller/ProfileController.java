package com.fraudscanner.authservice.controller;

import com.fraudscanner.authservice.dto.ChangePasswordRequest;
import com.fraudscanner.authservice.dto.ProfileResponse;
import com.fraudscanner.authservice.dto.UpdateProfileRequest;
import com.fraudscanner.authservice.service.JwtService;
import com.fraudscanner.authservice.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService, JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Long userId = extractUserId(authorizationHeader);
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UpdateProfileRequest request
    ) {
        Long userId = extractUserId(authorizationHeader);
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changeMyPassword(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody ChangePasswordRequest request
    ) {
        Long userId = extractUserId(authorizationHeader);
        profileService.changePassword(userId, request);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/me/picture")
    public ResponseEntity<ProfileResponse> uploadProfilePicture(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("file") MultipartFile file
    ) {
        Long userId = extractUserId(authorizationHeader);
        return ResponseEntity.ok(profileService.uploadProfilePicture(userId, file));
    }

    private Long extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid authorization header");
        }

        String token = authorizationHeader.substring(7);
        return jwtService.extractUserId(token);
    }
}