const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'courses.json');
app.use(express.json());
const VALID_STATUSES = ["Not Started", "In Progress", "Completed"];
function readCourses() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    throw new Error('File read error: ' + error.message);
  }
}
function writeCourses(courses) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2));
  } catch (error) {
    throw new Error('File write error: ' + error.message);
  }
}
readCourses();
app.get('/', (req, res) => {
  res.json({ message: 'CodeCraftHub API is Working!' });
});
app.post('/api/courses', (req, res) => {
  try {
    const { name, description, target_date, status } = req.body;
    if (!name || !description || !target_date || !status) {
      return res.status(400).json({ error: 'Missing required fields: name, description, target_date, status are required' });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: "Not Started", "In Progress", or "Completed"' });
    }
    const courses = readCourses();
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const newCourse = { id: newId, name, description, target_date, status, created_at: new Date().toISOString() };
    courses.push(newCourse);
    writeCourses(courses);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/courses', (req, res) => {
  try {
    const courses = readCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/courses/stats', (req, res) => {
  try {
    const courses = readCourses();
    const byStatus = {
      "Not Started": 0,
      "In Progress": 0,
      "Completed": 0
    };
    courses.forEach(c => {
      if (byStatus[c.status] !== undefined) byStatus[c.status]++;
    });
    res.json({
      total: courses.length,
      totalCourses: courses.length,
      byStatus: byStatus,
      by_status: byStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Course not found' });
    const { name, description, target_date, status } = req.body;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be: "Not Started", "In Progress", or "Completed"' });
    }
    if (name) courses[index].name = name;
    if (description) courses[index].description = description;
    if (target_date) courses[index].target_date = target_date;
    if (status) courses[index].status = status;
    writeCourses(courses);
    res.json(courses[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Course not found' });
    const deleted = courses.splice(index, 1)[0];
    writeCourses(courses);
    res.json({ message: 'Course deleted successfully', course: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log('CodeCraftHub API is starting...');
  console.log(`Data will be stored in: '${DATA_FILE}'`);
  console.log(`API is available at: 'http://localhost:5000'`);
});