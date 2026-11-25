
package com.hiretrack.backend.controller;

import com.hiretrack.backend.entity.JobApplication;
import com.hiretrack.backend.service.ApplicationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping(
            value = "/{jobId}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<JobApplication> applyForJob(
            @PathVariable Long jobId,
            @RequestPart("application") JobApplication application,
            @RequestPart("resume") MultipartFile resume,
            @AuthenticationPrincipal Jwt jwt)
            throws IOException {

        application.setCandidateEmail(jwt.getSubject());

        JobApplication savedApplication =
                applicationService.applyForJob(
                        jobId,
                        application,
                        resume
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedApplication);
    }

    @GetMapping("/candidate/{email}")
    public ResponseEntity<List<JobApplication>> getCandidateApplications(
            @PathVariable String email,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                applicationService.getCandidateApplications(
                        jwt.getSubject()
                )
        );
    }

    @GetMapping("/recruiter/{email}")
    public ResponseEntity<List<JobApplication>> getRecruiterApplications(
            @PathVariable String email,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                applicationService.getRecruiterApplications(
                        jwt.getSubject()
                )
        );
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<JobApplication> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(
                        applicationId,
                        status,
                        jwt.getSubject()
                )
        );
    }

    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<FileSystemResource> downloadResume(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal Jwt jwt) {

        Path filePath = applicationService.getResumeFile(
                applicationId,
                jwt.getSubject()
        );

        FileSystemResource resource =
                new FileSystemResource(filePath.toFile());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                filePath.getFileName() + "\""
                )
                .body(resource);
    }
}
