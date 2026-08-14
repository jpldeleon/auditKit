# AuditKit // by John

[![Live Demo](https://img.shields.io/badge/Live-Render-blue?style=flat-square&logo=render)](https://auditkit.onrender.com)

A full-stack SEO health auditor and web application designed to generate instant technical SEO and performance breakdowns for any given URL.

## Features
* **Core Web Vitals & Performance Scores:** Analyzes and displays Google PageSpeed insights for Performance, Accessibility, Best Practices, and SEO.
* **Detailed Metrics Breakdown:** Tracks FCP, LCP, TBT, CLS, and Speed Index.
* **On-Page SEO Checks:** Evaluates title tags, meta description lengths, H1 tag distribution, missing image alt attributes, canonical tags, robots meta tags, and Open Graph tags.
* **Nordic-Aurora Aesthetic:** Features a custom Nord-inspired dark theme coupled with vibrant Aurora color-coding across scores, badges, and the UI layout.

## Tech Stack
* **Backend:** Node.js, Express, Cheerio (for metadata scraping), Google PageSpeed Insights API
* **Frontend:** HTML5, CSS3 (Custom CSS variables), Vanilla JavaScript

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jpldeleon/auditkit.git
   cd auditkit

2. **Install dependencies:**
   ```bash
   npm install

3. **Configure your environment variables:</br>
Create a `.env` file in the root directory and add your Google PageSpeed API key:**
    ```bash
    PAGESPEED_API_KEY=your_actual_api_key_here
  
4. **Run the application**
 ```bash
   node server.js
   ```   
4. **Open the browser:**
   Navigate to http://localhost:5000 in your web browser.