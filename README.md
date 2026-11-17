# CodeCraftHub API

A simple Flask REST API to manage learning courses. Built for beginners learning REST APIs.

## Features
- Add a new course
- Get all courses / Get one course
- Update a course
- Delete a course
- Validation for required fields and status

Status allowed: Not Started, In Progress, Completed

## Installation
pip install flask

## How to Run
python app.py
Open: http://127.0.0.1:5000/api/courses

## API Endpoints
- GET /api/courses - Get all courses
- GET /api/courses/<id> - Get one course
- POST /api/courses - Add course
  Body: {"name":"Python Basics","description":"Learn Python","target_date":"2026-12-01","status":"Not Started"}
- PUT /api/courses/<id> - Update course
- DELETE /api/courses/<id> - Delete course

## Testing
Tested with PowerShell Invoke-RestMethod:
GET, POST, PUT, DELETE all working.
Error cases: Missing fields -> 400, Invalid status -> 400, Not found -> 404

## Project Structure
app.py - Main Flask app
README.md - This file