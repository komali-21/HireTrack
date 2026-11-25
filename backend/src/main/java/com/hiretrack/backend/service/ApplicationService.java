
package com.hiretrack.backend.service;

import com.hiretrack.backend.entity.Job;
import com.hiretrack.backend.entity.JobApplication;
import com.hiretrack.backend.repository.ApplicationRepository;
import com.hiretrack.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

   
public JobApplication applyForJob(
        Long jobId,
        JobApplication application,
        MultipartFile resume) throws IOException {

    Job job = jobRepository.findById(jobId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Job not found"));

    if (resume == null || resume.isEmpty()) {
        throw new IllegalArgumentException("Resume is required");
    }

    String originalName = resume.getOriginalFilename();

    if (originalName == null ||
            !originalName.toLowerCase().endsWith(".pdf")) {
        throw new IllegalArgumentException("Only PDF files are allowed");
    }

    Path uploadDirectory = Path.of("uploads", "resumes");
    Files.createDirectories(uploadDirectory);

    String storedName = UUID.randomUUID() + ".pdf";

    Path filePath = uploadDirectory.resolve(storedName);
    Files.copy(resume.getInputStream(), filePath);

    application.setJobId(job.getId());
    application.setJobTitle(job.getTitle());
    application.setCompany(job.getCompany());
    application.setRecruiterEmail(job.getRecruiterEmail());
    application.setResumeFileName(
            Path.of(originalName).getFileName().toString()
    );
    application.setResumeStoredName(storedName);
    application.setStatus("Pending");
    application.setAppliedAt(LocalDateTime.now());

    return applicationRepository.save(application);
}


    public List<JobApplication> getCandidateApplications(String email) {
        return applicationRepository.findByCandidateEmail(email);
    }

    public List<JobApplication> getRecruiterApplications(String email) {
        return applicationRepository.findByRecruiterEmail(email);
    }
    public JobApplication updateApplicationStatus(
        Long applicationId,
        String status,
        String recruiterEmail) {

    JobApplication application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Application not found"));

    if (!application.getRecruiterEmail().equals(recruiterEmail)) {
        throw new IllegalArgumentException(
                "You cannot update this application");
    }

    if (!status.equals("Pending")
            && !status.equals("Shortlisted")
            && !status.equals("Rejected")
            && !status.equals("Selected")) {
        throw new IllegalArgumentException("Invalid status");
    }

    application.setStatus(status);

    return applicationRepository.save(application);
}
public Path getResumeFile(
        Long applicationId,
        String recruiterEmail) {

    JobApplication application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new IllegalArgumentException("Application not found"));

    if (!application.getRecruiterEmail().equals(recruiterEmail)) {
        throw new IllegalArgumentException(
                "You cannot access this resume");
    }

    if (application.getResumeStoredName() == null) {
        throw new IllegalArgumentException("Resume not found");
    }

    Path filePath = Path.of(
            "uploads",
            "resumes",
            application.getResumeStoredName()
    );

    if (!Files.exists(filePath)) {
        throw new IllegalArgumentException("Resume file not found");
    }

    return filePath;
}
}
