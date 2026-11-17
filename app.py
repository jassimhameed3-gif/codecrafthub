from flask import Flask, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)
DATA_FILE = 'courses.json'
VALID_STATUSES = ["Not Started", "In Progress", "Completed"]

def init_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)

def load_courses():
    try:
        init_file()
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_courses(courses):
    with open(DATA_FILE, 'w') as f:
        json.dump(courses, f, indent=2)

@app.route('/api/courses', methods=['POST'])
def add_course():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('description') or not data.get('target_date') or not data.get('status'):
        return jsonify({"error": "Missing required fields"}), 400
    if data['status'] not in VALID_STATUSES:
        return jsonify({"error": "Invalid status"}), 400
    courses = load_courses()
    new_id = max([c['id'] for c in courses], default=0) + 1
    new_course = {
        "id": new_id,
        "name": data['name'],
        "description": data['description'],
        "target_date": data['target_date'],
        "status": data['status'],
        "created_at": datetime.now().isoformat()
    }
    courses.append(new_course)
    save_courses(courses)
    return jsonify(new_course), 201

@app.route('/api/courses', methods=['GET'])
def get_courses():
    return jsonify(load_courses()), 200

@app.route('/api/courses/stats', methods=['GET'])
def get_stats():
    courses = load_courses()
    stats = {
        "total": len(courses),
        "Not Started": sum(1 for c in courses if c['status'] == 'Not Started'),
        "In Progress": sum(1 for c in courses if c['status'] == 'In Progress'),
        "Completed": sum(1 for c in courses if c['status'] == 'Completed')
    }
    return jsonify(stats), 200

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    for c in load_courses():
        if c['id'] == course_id:
            return jsonify(c), 200
    return jsonify({"error": "Course not found"}), 404

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    data = request.get_json()
    courses = load_courses()
    for c in courses:
        if c['id'] == course_id:
            if 'status' in data and data['status'] not in VALID_STATUSES:
                return jsonify({"error": "Invalid status"}), 400
            c.update(data)
            save_courses(courses)
            return jsonify(c), 200
    return jsonify({"error": "Course not found"}), 404

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    courses = load_courses()
    new_list = [c for c in courses if c['id'] != course_id]
    if len(new_list) == len(courses):
        return jsonify({"error": "Course not found"}), 404
    save_courses(new_list)
    return jsonify({"message": "Course deleted"}), 200

if __name__ == '__main__':
    init_file()
    app.run(debug=True, port=5000)