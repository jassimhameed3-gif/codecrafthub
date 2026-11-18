package com.codecrafthub.service;

import com.codecrafthub.model.Course;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {
    private final File file = new File("courses.json");
    private final ObjectMapper mapper = new ObjectMapper();
    private List<Course> courses = new ArrayList<>();
    private long nextId = 1;

    public CourseService() { load(); }

    private void load() {
        try {
            if (file.exists()) {
                courses = mapper.readValue(file, new TypeReference<List<Course>>(){});
                for (Course c : courses) if (c.getId() >= nextId) nextId = c.getId() + 1;
            }
        } catch (Exception e) { courses = new ArrayList<>(); }
    }

    private void save() {
        try { mapper.writerWithDefaultPrettyPrinter().writeValue(file, courses); }
        catch (Exception e) { e.printStackTrace(); }
    }

    public List<Course> getAll() { return courses; }
    public Course getById(Long id) {
        return courses.stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
    }
    public Course create(Course c) {
        c.setId(nextId++);
        courses.add(c);
        save();
        return c;
    }
    public Course update(Long id, Course updated) {
        Course c = getById(id);
        if (c == null) return null;
        if (updated.getName() != null) c.setName(updated.getName());
        if (updated.getDescription() != null) c.setDescription(updated.getDescription());
        if (updated.getTarget_date() != null) c.setTarget_date(updated.getTarget_date());
        if (updated.getStatus() != null) c.setStatus(updated.getStatus());
        save();
        return c;
    }
    public boolean delete(Long id) {
        boolean removed = courses.removeIf(c -> c.getId().equals(id));
        if (removed) save();
        return removed;
    }
}