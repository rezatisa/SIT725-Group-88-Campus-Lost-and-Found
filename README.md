# Campus Lost & Found - Docker Deployment

## Submission by Reza Tisa Adi Pratama

**Student ID:** 226169199  
**Assignment:** 8.2HD Docker: End-to-End Application Deployment

---

## Project Overview

A web application for reporting and browsing lost and found items on campus. Users can report lost or found items and browse a centralized database of all reports.

Note: This application has core functionality working (create report, display reports). 
Some features are still in development (search, photo upload, authentication).

**Original Group Repository:** https://github.com/mofareh221172728/SIT725-Group-88-Campus-Lost-and-Found 

**Individual HD Submission:** https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found

**Readme :** https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found#readme

---

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (v18), Express.js
- **Database:** MongoDB (v7.0)
- **Containerization:** Docker & Docker Compose
- **Architecture:** MVC (Model-View-Controller)

---

## How to Run with Docker

### Prerequisites

- Docker Desktop installed
- Docker Compose installed (included with Docker Desktop)

### Quick Start (3 Steps)

#### Step 1: Clone Repository

```bash
git clone https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found.git
cd SIT725-Group-88-Campus-Lost-and-Found
```
**copy .env file (download link provided in the ontrack submission)**

#### Step 2: Start Docker Containers

```bash
docker-compose up --build
```

Expected output:
```
✓ Connected to MongoDB
✓ Server running at http://localhost:3000
```

#### Step 3: Access Application

Open your browser:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api/items
- **Student Info:** http://localhost:3000/api/student

---

## Testing the Application

### 1. Create a Report

1. Go to http://localhost:3000
2. Click **"Create Report"**
3. Fill form and click **Submit Report**
4. You should see: **"Report submitted successfully!"**

### 2. View Reports

1. Click **"Main"** or refresh http://localhost:3000
2. Your report should appear as a card on the browse page

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
├── Dockerfile                # Application container config
├── docker-compose.yml        # Service orchestration
├── .dockerignore             # Exclude files from build
├── server.js                 # Express server with MVC
├── package.json              # Dependencies
│
├── controllers/
│   └── item.controller.js    # Business logic
├── routes/
│   └── item.routes.js        # API endpoints
├── models/                   # Database schemas
│   ├── lostItem.model.js
│   ├── foundItem.model.js
│   └── user.model.js
│
├── public/                   # Frontend
│   ├── index.html
│   ├── report.html
│   ├── browse.html
│   ├── css/
│   └── js/
│       ├── report-form.js    # Form submission
│       └── browse.js         # Display items
│
└── .env                      # Environment variables
```

---

## API Endpoints

### GET /api/items
Retrieve all lost and found items

```bash
curl http://localhost:3000/api/items
```

Response:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "type": "found",
    "title": "Blue Backpack",
    "category": "Bags & Backpacks",
    "description": "Blue backpack found in library",
    "date": "2024-09-08T00:00:00.000Z",
    "location": "Melbourne Burwood - A Building",
    "status": "active",
    "photos": []
  }
]
```

### POST /api/items
Create a new report

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "found",
    "title": "Red Wallet",
    "category": "Student Cards, Wallets, IDs",
    "date": "2026-09-08",
    "description": "Red wallet with student ID",
    "campus": "Melbourne Burwood",
    "building": "B Building",
    "room": "B312",
    "handoverMethod": "dropoff"
  }'
```

### GET /api/student
Get student identification (HD submission)

```bash
curl http://localhost:3000/api/student
```

Response:
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

**.env file:**
```
MONGODB_URI=mongodb://admin:password123@mongodb:27017/sit725-group-88?authSource=admin
```

For local development (without Docker):
```
MONGODB_URI=mongodb://localhost:27017/sit725-group-88
```

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

## Troubleshooting

### MongoDB connection error
**Error:** `MongoDB error: getaddrinfo ENOTFOUND mongodb`

**Solution:** Ensure `.env` has correct MongoDB URI for Docker:
```
MONGODB_URI=mongodb://admin:password123@mongodb:27017/sit725-group-88?authSource=admin
```

### Port already in use
**Error:** `Bind for 0.0.0.0:3000 failed`

**Solution:**
```bash
docker-compose down
docker-compose up
```

### Fresh start
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## Features

✅ **Create Reports** - Users can report lost or found items  
✅ **Browse Reports** - All reports displayed on main page  
✅ **Database Integration** - MongoDB stores all data  
✅ **Docker Deployment** - Containerized with Docker Compose  
✅ **MVC Architecture** - Clean separation of concerns  
✅ **API Endpoints** - RESTful API for all operations  
✅ **Student Endpoint** - /api/student returns student info  

---

## Development Notes

### Database Reset
To clear all data:
```bash
docker-compose down -v
docker-compose up
```

### Debugging
View app console output:
```bash
docker-compose logs app -f
```

---
---

## References

- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- MongoDB: https://docs.mongodb.com
- Express.js: https://expressjs.com
- Mongoose: https://mongoosejs.com

---