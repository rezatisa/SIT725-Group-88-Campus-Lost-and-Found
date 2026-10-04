# Campus Lost & Found - Docker Deployment

## Submission by Reza Tisa Adi Pratama

**Student ID:** 226169199  
**Assignment:** 8.2HD Docker: End-to-End Application Deployment

---

## Project Overview

A web application for reporting and browsing lost and found items on campus. Users can report lost or found items and browse a centralized database of all reports.

Note: This application has core functionality working (create report, display reports). 
Some features are still in development (search, authentication).


**Github repository:** https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found
 
**Readme:** https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found#readme

---

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (v20), Express.js
- **Database:** MongoDB (v7.0)
- **Containerization:** Docker & Docker Compose
- **Architecture:** MVC (Model-View-Controller)

---

## How to Run with Docker

### Prerequisites

- Docker Desktop installed **and running** (the whale icon shows "Engine running")
- Docker Compose installed (included with Docker Desktop)
- Git installed (for `git clone`)

### Where to Run the Commands

Run all commands in a terminal (Windows: **PowerShell**, macOS/Linux: **Terminal**, or the VS Code terminal) from the project folder.

### Quick Start (5 Steps)

#### Step 1: Clone Repository

```bash
git clone https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found.git
cd SIT725-Group-88-Campus-Lost-and-Found
```

#### Step 2: Add the .env File

The `.env` file is **not included in this repository for security reasons** (it contains the database credentials).

1. Download the `.env` file from the link in the **OnTrack submission**.
2. Place it in the project folder (the same folder as `docker-compose.yml`).
3. Some browsers save it as `env` (without the dot). If so, rename it to `.env`.

#### Step 3: Start Docker Containers

> **Before you start:** make sure **Docker Desktop is open and running** (bottom-left shows **"Engine running"**). If it is not running, the command below fails with an error like `error during connect` or `Cannot connect to the Docker daemon`.

**Run in:** the project folder from Step 1 (the folder that contains `docker-compose.yml`).

```bash
docker-compose up --build -d
```

Don't forget **`-d`**. It runs Docker in the background, so after a short wait the terminal shows the prompt again and you can keep typing.

#### Step 4: Load Sample Data

In the **same terminal** as Step 3, run:

```bash
docker-compose exec app node scripts/seed.js
```

You should see:
```
✓ Added 4 found and 3 lost sample reports.
```

This adds 7 sample reports with pictures. If the database already has data, nothing is added.

#### Step 5: Access Application

Open your browser and use these pages (they are connected to MongoDB):

| Menu | URL | What it does |
|------|-----|--------------|
| **Main** | http://localhost:3000/browse.html | Shows all reports from the database |
| **Create Report** | http://localhost:3000/report.html | Submits a new lost/found report with photos |
| **Item Detail** | Click a card on **Main** | Shows the full report and its photos |

> The other menu items (**Login**, **Search & Filter**, **My Reports**) are UI previews only and are not connected to the backend yet.

API endpoints:
- **All reports:** http://localhost:3000/api/items
- **Student info:** http://localhost:3000/api/student

---

## Testing the Application

### 1. Create a Report

1. Go to http://localhost:3000/browse.html
2. Click **"Create Report"** in the top menu
3. Fill the form
4. (Optional) Under **Item Photos**, click **File** and choose up to 3 photos (JPEG, PNG or WebP, max 5 MB each)
5. Click **Submit Report**
6. You should see: **"Report submitted successfully!"**

### 2. View Reports

1. Click **"Main"** or refresh http://localhost:3000/browse.html
2. Your report should appear as a card on the browse page, showing the first uploaded photo
3. Click the card to open **Item Detail** and see all uploaded photos

### 3. Verify API Endpoints

**Get all items:**
```bash
curl http://localhost:3000/api/items
```

**Get student info:**
```bash
curl http://localhost:3000/api/student
```

Should return:
```json
{
  "name": "Reza Tisa Adi Pratama",
  "studentId": "226169199"
}
```

---

## Docker Architecture

### Services

#### MongoDB Container
- **Image:** mongo:7.0
- **Port:** 27017
- **Database:** sit725-group-88
- **Persistence:** Data saved in `mongodb_data` volume

#### Node.js Application Container
- **Built from:** Dockerfile
- **Port:** 3000
- **Environment:** Production
- **Depends on:** MongoDB service

### File Structure

```
project/
├── .gitignore                # Files to exclude from Git
├── README.md                 # Project documentation
├── Dockerfile                # Application container config
├── docker-compose.yml        # Service orchestration
├── .dockerignore             # Exclude files from build
├── server.js                 # Express server with MVC
├── package.json              # Dependencies
│
├── scripts/
│   └── seed.js               # Loads sample reports into MongoDB
│
├── controllers/
│   ├── item.controller.js    # Business logic
│   └── photo.controller.js   # Serves uploaded photos
├── middleware/
│   └── photo-upload.middleware.js  # Multer upload limits (3 photos, 5 MB, JPEG/PNG/WebP)
├── routes/
│   ├── item.routes.js        # Item API endpoints
│   └── photo.routes.js       # Photo API endpoint
├── models/                   # Database schemas
│   ├── lostItem.model.js     # Lost item schema
│   ├── foundItem.model.js    # Found item schema
│   ├── photo.model.js        # Uploaded photo schema
│   └── user.model.js         # User schema (future)
│
├── public/                   # Frontend (Views)
│   ├── index.html            # Home page
│   ├── report.html           # Report creation page
│   ├── images/samples/       # Illustrations used by the sample reports
│   ├── browse.html           # Browse items page
│   ├── css/                  # Stylesheets
│   │   ├── style.css         # Main styles
│   │   ├── browse.css        # Browse page styles
│   │   └── report.css        # Report page styles
│   └── js/                   # JavaScript files
│       ├── main.js           # Utility functions
│       ├── report-form.js    # Form submission
│       ├── browse.js         # Display items
│       └── report-validation.js  # Form validation
│
├── .env.example              # Variable names only (no real values)
└── .env                      # Real values, provided via OnTrack (not committed)
```

---

## Environment Variables

The application reads its settings from a `.env` file in the project root. For security reasons this file is **not committed to Git**. The marker can download it from the link in the **OnTrack submission** (see Step 2).

`.env.example` only lists the variable names and does not contain real values.

Inside Docker, the database host is the `mongodb` service name, not `localhost`.

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on (default `3000`) |
| `MONGODB_URI` | MongoDB connection string (host `mongodb` when running in Docker) |

---

## Useful Docker Commands

```bash
# Stop the containers (data is kept)
docker-compose down

# Stop the containers and delete all database data
docker-compose down -v
```

---

## Development Notes

### Database Reset
To clear all data and start again with the sample reports:
```bash
docker-compose down -v
docker-compose up --build -d
docker-compose exec app node scripts/seed.js
```

### Debugging
View app console output:
```bash
docker-compose logs app -f
```