
package com.hiretrack.backend.controller;

import com.hiretrack.backend.entity.Job;
import com.hiretrack.backend.service.JobService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<Job> createJob(
            @RequestBody Job job,
            @AuthenticationPrincipal Jwt jwt) {

        job.setRecruiterEmail(jwt.getSubject());

        Job savedJob = jobService.createJob(job);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/recruiter/{email}")
    public ResponseEntity<List<Job>> getRecruiterJobs(
            @PathVariable String email,
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                jobService.getRecruiterJobs(jwt.getSubject())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        jobService.deleteJob(id, jwt.getSubject());

        return ResponseEntity.noContent().build();
    }
}
