package com.icms.controller;

import com.icms.model.Worker;
import com.icms.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin("*")
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Worker> addWorker(@RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.addWorker(worker));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Worker> updateWorker(@PathVariable Long id, @RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.updateWorker(id, worker));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.ok("Worker deleted");
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getDepartmentStats() {
        return ResponseEntity.ok(workerService.getWorkerCountByDepartment());
    }

    @GetMapping("/department/{dept}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Worker>> getByDepartment(@PathVariable String dept) {
        return ResponseEntity.ok(workerService.getWorkersByDepartment(dept));
    }
}
