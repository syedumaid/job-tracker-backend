const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const DATA_DIR = process.env.DATA_DIR || "./data";
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

app.use(cors());
app.use(express.json());

// Utility functions
function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

function readContacts() {
    return JSON.parse(fs.readFileSync(CONTACTS_FILE));
  }
  
  function writeContacts(contacts) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  }
  

// ======== JOB ROUTES =========
app.get("/jobs", (req, res) => {
  const jobs = readJSON(JOBS_FILE);
  res.json(jobs);
});

app.post("/jobs", (req, res) => {
  const jobs = readJSON(JOBS_FILE);
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
  writeJSON(JOBS_FILE, jobs);
  res.json(newJob);
});

app.put("/jobs/:id", (req, res) => {
  const jobs = readJSON(JOBS_FILE);
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
  writeJSON(JOBS_FILE, jobs);
  res.json(jobs[index]);
});

app.delete("/jobs/:id", (req, res) => {
  let jobs = readJSON(JOBS_FILE);
  jobs = jobs.filter(job => job.id !== req.params.id);
  writeJSON(JOBS_FILE, jobs);
  res.sendStatus(204);
});

app.patch("/jobs/:id/archive", (req, res) => {
  const jobs = readJSON(JOBS_FILE);
  const index = jobs.findIndex(job => job.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Job not found" });

  jobs[index].status = "Archived";
  writeJSON(JOBS_FILE, jobs);
  res.json(jobs[index]);
});

app.post("/jobs", (req, res) => {
    const jobs = readJSON(JOBS_FILE);
    const newJob = {
      id: Date.now().toString(),
      company: req.body.company,
      title: req.body.title,
      status: req.body.status,
      salary: req.body.salary || "",
      description: req.body.description || "",
      tags: req.body.tags || "",
      date: new Date().toISOString()  // <-- Add this line
    };
    jobs.push(newJob);
    writeJSON(JOBS_FILE, jobs);
    res.json(newJob);
  });
  

// ======== CONTACT ROUTES =========
app.get("/contacts", (req, res) => {
    const contacts = readContacts();
    res.json(contacts);
  });
  
  app.post("/contacts", (req, res) => {
    const contacts = readContacts();
    const newContact = { id: Date.now().toString(), ...req.body };
    contacts.push(newContact);
    writeContacts(contacts);
    res.json(newContact);
  });
  
  app.delete("/contacts/:id", (req, res) => {
    let contacts = readContacts();
    contacts = contacts.filter(contact => contact.id !== req.params.id);
    writeContacts(contacts);
    res.sendStatus(204);
  });
  
  app.patch("/contacts/:id/archive", (req, res) => {
    const contacts = readContacts();
    const index = contacts.findIndex(contact => contact.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Contact not found" });
    contacts[index].status = "archived";
    writeContacts(contacts);
    res.json(contacts[index]);
  });
  app.put("/contacts/:id", (req, res) => {
    const contacts = readContacts();
    const index = contacts.findIndex(contact => contact.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Contact not found" });
  
    contacts[index] = {
      ...contacts[index],
      name: req.body.name,
      platform: req.body.platform,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      role: req.body.role,
      status: req.body.status,
      comments: req.body.comments
    };
    app.post("/contacts", (req, res) => {
        const contacts = readContacts();
        const newContact = {
          id: Date.now().toString(),
          ...req.body,
          date: new Date().toISOString()  // <-- Add this line
        };
        contacts.push(newContact);
        writeContacts(contacts);
        res.json(newContact);
      });
      
  
    writeContacts(contacts);
    res.json(contacts[index]);
  });
  
// Start server
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
