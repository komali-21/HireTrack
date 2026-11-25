
package com.hiretrack.backend.repository;

import com.hiretrack.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterEmail(String recruiterEmail);

}
