
package com.hiretrack.backend.repository;

import com.hiretrack.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateEmail(String candidateEmail);

    List<JobApplication> findByRecruiterEmail(String recruiterEmail);

    List<JobApplication> findByJobId(Long jobId);
}
