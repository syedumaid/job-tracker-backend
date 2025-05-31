// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const DATA_DIR = process.env.DATA_DIR || "./data";
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

app.use(cors());
app.use(express.json());

// Read jobs from file
function readJobs() {
  return JSON.parse(fs.readFileSync(JOBS_FILE));
}

// Write jobs to file
function writeJobs(jobs) {
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

// Get all jobs
app.get("/jobs", (req, res) => {
  const jobs = readJobs();
  res.json(jobs);
});

// Add new job
app.post("/jobs", (req, res) => {
    const jobs = readJobs();
    const newJob = {
      id: Date.now().toString(),
      company: req.body.company,
      title: req.body.title,
      status: req.body.status,
      salary: req.body.salary || "",
      description: req.body.description || "",
      tags: req.body.tags || ""
    };
    jobs.push(newJob);
    writeJobs(jobs);
    res.json(newJob);
  });
  

// Update job
app.put("/jobs/:id", (req, res) => {
    const jobs = readJobs();
    const index = jobs.findIndex(job => job.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Job not found" });
  
    jobs[index] = {
      ...jobs[index],
      company: req.body.company,
      title: req.body.title,
      status: req.body.status,
      salary: req.body.salary || "",
      description: req.body.description || "",
      tags: req.body.tags || ""
    };
  
    writeJobs(jobs);
    res.json(jobs[index]);
  });
  

// Delete job
app.delete("/jobs/:id", (req, res) => {
  let jobs = readJobs();
  jobs = jobs.filter(job => job.id !== req.params.id);
  writeJobs(jobs);
  res.sendStatus(204);
});

// Archive job
app.patch("/jobs/:id/archive", (req, res) => {
  const jobs = readJobs();
  const index = jobs.findIndex(job => job.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Job not found" });

  jobs[index].status = "Archived";
  writeJobs(jobs);
  res.json(jobs[index]);
});

// Start server
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
