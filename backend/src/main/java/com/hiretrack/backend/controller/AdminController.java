
package com.hiretrack.backend.controller;

import com.hiretrack.backend.entity.Job;
import com.hiretrack.backend.repository.UserRepository;
import com.hiretrack.backend.repository.JobRepository;
import com.hiretrack.backend.repository.ApplicationRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import com.hiretrack.backend.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminController(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {

        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardSummary() {

        List<Job> allJobs = jobRepository.findAll();

        List<Job> recentJobs = jobRepository.findAll(
                Sort.by(Sort.Direction.DESC, "id")
        ).stream().limit(3).toList();

        long totalCompanies = allJobs.stream()
                .map(Job::getCompany)
                .filter(company -> company != null && !company.isBlank())
                .distinct()
                .count();

        Map<String, Object> summary = new LinkedHashMap<>();

        summary.put("totalUsers", userRepository.count());
        summary.put("totalJobs", jobRepository.count());
        summary.put("totalApplications", applicationRepository.count());
        summary.put("totalCompanies", totalCompanies);
        summary.put("recentJobs", recentJobs);

        return summary;
    }
    @GetMapping("/recruiters")
public List<Map<String, Object>> getRecruiters() {

    List<User> recruiters = userRepository.findAll()
            .stream()
            .filter(user -> "RECRUITER".equalsIgnoreCase(user.getRole()))
            .toList();

    List<Map<String, Object>> result = new ArrayList<>();

    for (User recruiter : recruiters) {

        List<Job> recruiterJobs =
                jobRepository.findByRecruiterEmail(recruiter.getEmail());

        List<String> companies = recruiterJobs.stream()
                .map(Job::getCompany)
                .filter(company -> company != null && !company.isBlank())
                .distinct()
                .toList();

        Map<String, Object> details = new LinkedHashMap<>();

        details.put("id", recruiter.getId());
        details.put("name", recruiter.getName());
        details.put("email", recruiter.getEmail());
        details.put("jobCount", recruiterJobs.size());
        details.put("companies", companies);

        result.add(details);
    }

    return result;
}
@GetMapping("/jobs")
public List<Job> getAllJobs() {
    return jobRepository.findAll(
            Sort.by(Sort.Direction.DESC, "id")
    );
}

@DeleteMapping("/jobs/{id}")
public ResponseEntity<?> deleteJob(@PathVariable Long id) {

    if (!jobRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    jobRepository.deleteById(id);

    return ResponseEntity.ok(
            Map.of("message", "Job deleted successfully")
    );
}
}
