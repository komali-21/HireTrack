
package com.hiretrack.backend.controller;

import com.hiretrack.backend.entity.User;
import com.hiretrack.backend.service.UserService;
import com.hiretrack.backend.repository.UserRepository;
import com.hiretrack.backend.dto.UserResponse;
import com.hiretrack.backend.dto.AuthResponse;
import com.hiretrack.backend.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            UserRepository userRepository,
            JwtService jwtService) {

        this.userService = userService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // Register Candidate or Recruiter
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            String role = user.getRole();

            if (role == null ||
                    (!role.equalsIgnoreCase("CANDIDATE") &&
                     !role.equalsIgnoreCase("RECRUITER"))) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid role. Only Candidate and Recruiter registration is allowed.");
            }

            user.setRole(role.toUpperCase(Locale.ROOT));

            User savedUser = userService.registerUser(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new UserResponse(
                            savedUser.getId(),
                            savedUser.getName(),
                            savedUser.getEmail(),
                            savedUser.getRole()
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    // Login and generate JWT token
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            User loggedInUser = userService.loginUser(
                    user.getEmail(),
                    user.getPassword()
            );

            String token = jwtService.generateToken(loggedInUser);

            return ResponseEntity.ok(
                    new AuthResponse(
                            loggedInUser.getId(),
                            loggedInUser.getName(),
                            loggedInUser.getEmail(),
                            loggedInUser.getRole(),
                            token
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // Get own profile only
    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getProfile(
            @PathVariable String email,
            @AuthenticationPrincipal Jwt jwt) {

        if (!email.equalsIgnoreCase(jwt.getSubject())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot access another user's profile");
        }

        User user = userRepository.findByEmail(jwt.getSubject())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(getSafeUserDetails(user));
    }

    // Update own profile only
    @PutMapping("/profile/{email}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String email,
            @RequestBody User profile,
            @AuthenticationPrincipal Jwt jwt) {

        if (!email.equalsIgnoreCase(jwt.getSubject())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You cannot update another user's profile");
        }

        User user = userRepository.findByEmail(jwt.getSubject())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        user.setPhone(profile.getPhone());
        user.setEducation(profile.getEducation());
        user.setSkills(profile.getSkills());
        user.setExperience(profile.getExperience());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(getSafeUserDetails(savedUser));
    }

    // Admin can view all candidates
    @GetMapping("/candidates")
    public ResponseEntity<List<Map<String, Object>>> getCandidates() {

        List<Map<String, Object>> candidates = userRepository.findAll()
                .stream()
                .filter(user ->
                        "CANDIDATE".equalsIgnoreCase(user.getRole()))
                .map(this::getSafeUserDetails)
                .toList();

        return ResponseEntity.ok(candidates);
    }

    // Safe user details without password
    private Map<String, Object> getSafeUserDetails(User user) {

        Map<String, Object> details = new LinkedHashMap<>();

        details.put("id", user.getId());
        details.put("name", user.getName());
        details.put("email", user.getEmail());
        details.put("role", user.getRole());
        details.put("phone", user.getPhone());
        details.put("education", user.getEducation());
        details.put("skills", user.getSkills());
        details.put("experience", user.getExperience());

        return details;
    }
}
