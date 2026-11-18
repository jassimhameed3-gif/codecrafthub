package com.codecrafthub.model;

public class Course {
    private Long id;
    private String name;
    private String description;
    private String target_date;
    private String status;

    public Course() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTarget_date() { return target_date; }
    public void setTarget_date(String target_date) { this.target_date = target_date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}