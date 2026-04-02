package com.icms.repository;

import com.icms.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByDepartment(String department);
    List<Worker> findByStatus(Worker.Status status);
    long countByDepartment(String department);
}
