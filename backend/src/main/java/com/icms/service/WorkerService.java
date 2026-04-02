package com.icms.service;

import com.icms.model.Worker;
import com.icms.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public Worker addWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    public Worker updateWorker(Long id, Worker updated) {
        Worker existing = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        existing.setName(updated.getName());
        existing.setDepartment(updated.getDepartment());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setStatus(updated.getStatus());
        return workerRepository.save(existing);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }

    public Map<String, Long> getWorkerCountByDepartment() {
        return workerRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        Worker::getDepartment,
                        Collectors.counting()
                ));
    }

    public List<Worker> getWorkersByDepartment(String department) {
        return workerRepository.findByDepartment(department);
    }
}
