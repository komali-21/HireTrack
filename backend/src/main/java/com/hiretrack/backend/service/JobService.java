
package com.hiretrack.backend.service;

import com.hiretrack.backend.entity.Job;
import com.hiretrack.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getRecruiterJobs(String recruiterEmail) {
        return jobRepository.findByRecruiterEmail(recruiterEmail);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Job not found"));
    }

    public void deleteJob(Long id, String recruiterEmail) {
        Job job = getJobById(id);

        if (!job.getRecruiterEmail().equals(recruiterEmail)) {
            throw new IllegalArgumentException("You cannot delete this job");
        }

        jobRepository.delete(job);
    }
}
