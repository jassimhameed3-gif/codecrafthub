package com.codecrafthub.controller;

import com.codecrafthub.model.Course;
import com.codecrafthub.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    private final CourseService service;
    public CourseController(CourseService service) { this.service = service; }

    @GetMapping
    public List<Course> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getOne(@PathVariable Long id) {
        Course c = service.getById(id);
        return c == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(c);
    }

    @PostMapping
    public Course create(@RequestBody Course c) { return service.create(c); }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course c) {
        Course updated = service.update(id, c);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}