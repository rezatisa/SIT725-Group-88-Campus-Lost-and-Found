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

All commands below are typed in a terminal:

| Operating system | Terminal to use | How to open it |
|------------------|-----------------|----------------|
| Windows | **PowerShell** (recommended) or Command Prompt | Press `Win`, type `PowerShell`, press Enter |
| macOS | **Terminal** | Press `Cmd + Space`, type `Terminal`, press Enter |
| Linux | **Terminal** | Press `Ctrl + Alt + T` |

You can also use the terminal built into VS Code (**Terminal → New Terminal**), which opens in the project folder automatically.

Commands in Steps 2–4 must be run **inside the project folder** (the folder that contains `docker-compose.yml`). After Step 1 you are already there. If you open a new terminal later, go back to it first, for example:

```bash
cd path/to/SIT725-Group-88-Campus-Lost-and-Found
```

> On newer Docker versions you can type `docker compose` (with a space) instead of `docker-compose`. Both work the same way.

### Quick Start (5 Steps)

#### Step 1: Clone Repository

```bash
git clone https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found.git
cd SIT725-Group-88-Campus-Lost-and-Found
```

#### Step 2: Create the .env File

Use **one** of these options:

**Option A:** Download the `.env` file from the link in the OnTrack submission and place it in the project root. Some browsers save it as `env` (without the dot). If so, rename it to `.env`.

**Option B:** Copy the provided `.env.example` to `.env` in the project root:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Both options contain the values the Docker setup needs.

#### Step 3: Start Docker Containers

```bash
docker-compose up --build
```

Expected output:
```
✓ Connected to MongoDB
✓ Server running at http://localhost:3000
```

#### Step 4: Load Sample Data

The database starts empty, so the Browse page shows **"No active reports available."** until data is added. Leave the first terminal running. Open a **second terminal** (a new PowerShell / Terminal window, or **+** in VS Code), go to the project folder with `cd`, and run:

```bash
docker-compose exec app node scripts/seed.js
```

Expected output:
```
✓ Connected to MongoDB
✓ Added 4 found and 3 lost sample reports.
```

Each sample report comes with an illustration from `public/images/samples/`, so the cards show a picture instead of "No photo". The script only adds sample reports when the database is empty, so running it again does not create duplicates. You can also skip this step and create your own report from **Create Report** (see [Testing the Application](#testing-the-application)).

#### Step 5: Access Application

Open your browser:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/items
- **Student Info:** http://localhost:3000/api/student

---

## Testing the Application

### 1. Create a Report

1. Go to http://localhost:3000
2. Click **"Create Report"**
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
├── .env.example              # Environment variable template (copy to .env)
└── .env                      # Environment variables (created from .env.example, not committed)
```

---

## API Endpoints

---

### POST /api/items
Create a new report

**Required Fields:** type, title, category, date, description, campus, building  
**Optional Fields:** room, handoverMethod, photos (up to 3 files)

Send JSON (no photos) or `multipart/form-data` (with photos). The Create Report page uses `multipart/form-data`.

**With photos:**
```bash
curl -X POST http://localhost:3000/api/items \
  -F type=found -F title="Blue Bottle" -F category="Other" \
  -F date=2026-10-01 -F description="Blue metal bottle" \
  -F campus="Melbourne Burwood" -F building="LC" \
  -F photos=@bottle.jpg
```

**Without photos (JSON):**

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "found",
    "title": "Red Wallet",
    "category": "Student Cards, Wallets, IDs",
    "date": "2024-09-08",
    "description": "Red wallet with student ID",
    "campus": "Melbourne Burwood",
    "building": "B Building",
    "room": "B312",
    "handoverMethod": "dropoff"
  }'
```

**Response (201 Created):**
```json
{
  "message": "Report created successfully!",
  "item": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "found",
    "title": "Red Wallet",
    "category": "Student Cards, Wallets, IDs",
    "date": "2024-09-08T00:00:00.000Z",
    "location": "Melbourne Burwood - B Building, B312",
    "status": "active"
  }
}
```
---
### GET /api/items
Retrieve all lost and found items

```bash
curl http://localhost:3000/api/items
```

**Response (200 OK):**
```json
[
  {
  "id": "507f1f77bcf86cd799439011",
  "_id": "507f1f77bcf86cd799439011",
  "type": "found",
  "title": "Red Wallet",
  "category": "Student Cards, Wallets, IDs",
  "description": "Red wallet with student ID",
  "date": "2024-09-08T00:00:00.000Z",
  "location": "Melbourne Burwood - B Building, B312",
  "status": "active",
  "photos": []
  }
]
```
---

### GET /api/photos/:id
Returns an uploaded photo (image bytes). Report photo URLs look like `/api/photos/<id>` and are used directly in `<img src="...">`.

```bash
curl -o photo.jpg http://localhost:3000/api/photos/<photo-id>
```

**Errors:** `404` if the photo does not exist.

---

### GET /api/student
Get student identification (HD submission)

```bash
curl http://localhost:3000/api/student
```

**Response (200 OK):**
```json
{
  "name": "Reza Tisa Adi Pratama",
  "studentId": "226169199"
}
```

---

## MVC Structure

### Model Layer
- **lostItem.model.js** - Lost item database schema
- **foundItem.model.js** - Found item database schema
- **user.model.js** - User authentication schema (future)

### View Layer
- **public/browse.html** - Display all items
- **public/report.html** - Report creation form
- **public/js/browse.js** - Fetch and display items
- **public/js/report-form.js** - Handle form submission

### Controller Layer
- **controllers/item.controller.js** - Business logic for items
  - `getAllItems()` - Fetch all reports
  - `createItem()` - Create new report
  - `getItemById()` - Get single item

---

## Environment Variables

The application reads its settings from a `.env` file in the project root. This file is not committed to Git. Either download it from the OnTrack submission link, or create it from the template:

**Steps:**
1. Place the downloaded `.env` in the project root (rename `env` to `.env` if needed), **or** copy `.env.example` to `.env` (`cp .env.example .env`, or `copy .env.example .env` on Windows)
2. Run `docker-compose up --build`

Inside Docker, the database host is the `mongodb` service name, not `localhost`.

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on (default `3000`) |
| `MONGODB_URI` | MongoDB connection string (host `mongodb` when running in Docker) |

---

## Useful Docker Commands

```bash
# Build containers
docker-compose build

# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs

# View app logs
docker-compose logs app

# View MongoDB logs
docker-compose logs mongodb

# Stop and remove everything
docker-compose down -v
```

---

## Features

✅ **Create Reports** - Users can report lost or found items  
✅ **Browse Reports** - All reports displayed on main page  
✅ **Photo Upload** - Up to 3 photos per report (JPEG, PNG, WebP, max 5 MB each), stored in MongoDB  
✅ **Database Integration** - MongoDB stores all data  
✅ **Docker Deployment** - Containerized with Docker Compose  
✅ **MVC Architecture** - Clean separation of concerns  
✅ **API Endpoints** - RESTful API for all operations  
✅ **Student Endpoint** - /api/student returns student info  

---

## Development Notes

### Database Reset
To clear all data and start again with the sample reports:
```bash
docker-compose down -v
docker-compose up --build
# in a second terminal
docker-compose exec app node scripts/seed.js
```

### Debugging
View app console output:
```bash
docker-compose logs app -f
```

---

## References

- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- MongoDB: https://docs.mongodb.com
- Express.js: https://expressjs.com
- Mongoose: https://mongoosejs.com

---