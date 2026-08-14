# AuditKit - Full-Stack API Capstone Project

An SEO health auditor web application built with Node.js, Express, Axios, and Cheerio.

## Live Demo
Check out the live application hosted on Render:  
**[auditkit.onrender.com](https://auditkit.onrender.com)**

---

## Key Features
* **SEO Metadata Parsing:** Evaluates title length, meta description, canonical tags, and OpenGraph images.
* **Content Structure Analysis:** Scans H1 heading counts and checks for missing image ALT attributes.
* **Speed Tracking:** Measures server response time with dynamic performance badges.
* **Interactive UI:** Smooth health-score animations and clean hidden-state dashboard logic.

---

## Tech Stack
* **Frontend:** HTML5, CSS3 (Nordic Theme), Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Scraping Engine:** Cheerio
* **Deployment:** Render + GitHub CI/CD pipeline

---

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/AUDITKIT.git
   cd AUDITKIT

2. **Install dependencies:**
   ```bash
   npm install

3. **Start the server:**
   ```bash
   node server.js
   ```
   
4. **Open the browser:**
   Navigate to http://localhost:5000 in your web browser.