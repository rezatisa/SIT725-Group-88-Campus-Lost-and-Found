# Campus Lost and Found System - Docker Deployment

## Individual HD Submission by [Your Full Name]

**Student ID:** 226169199  
**Course:** SIT725 Applied Software Engineering  
**Assignment:** 8.2HD Docker: End-to-End Application Deployment

---

## Project Overview

A web application for reporting and browsing lost and found items on campus. Users can report lost or found items and browse a centralized database of all reports.

**Original Group Repository:** https://github.com/mofareh221172728/SIT725-Group-88-Campus-Lost-and-Found  
**Individual HD Submission:** https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found

---

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (v18), Express.js (v5.2)
- **Database:** MongoDB (v7.0)
- **Containerization:** Docker & Docker Compose
- **Testing:** Mocha, Chai, Supertest
- **ODM:** Mongoose

---

## How to Run the Application

### Prerequisites

You need the following installed on your machine:

- **Docker Desktop** (includes Docker and Docker Compose)
  - Windows/Mac: Download from https://www.docker.com/products/docker-desktop
  - Linux: Install docker.io and docker-compose via your package manager

### Quick Start (3 Steps)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found
cd https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found
```

#### Step 2: Build and Start the Application

```bash
docker-compose up --build
```

**What happens:**
- Docker builds the Node.js application image
- MongoDB database starts and initializes
- Express server starts automatically
- All services are ready within 30 seconds

You should see output like:
```
mongodb: ... Connection accepted
app: Server running at http://localhost:3000
```

#### Step 3: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Student ID Endpoint:** http://localhost:3000/api/student
- **API Base:** http://localhost:3000/api

---

## Verifying Your Submission

### Test 1: Verify Application is Running

Navigate to http://localhost:3000 in your browser. You should see the Campus Lost and Found homepage.

### Test 2: Verify /api/student Endpoint

#### Method A: Browser
Open http://localhost:3000/api/student and you should see:
```json
{
  "name": "Your Full Name",
  "studentId": "Your Student ID"
}
```

#### Method B: Command Line (curl)
```bash
curl http://localhost:3000/api/student
```

Expected output:
```json
{"name":"Your Full Name","studentId":"Your Student ID"}
```

### Test 3: Verify Database Connection

#### Option 1: Use the Web UI
1. Go to http://localhost:3000
2. Click "Report Lost/Found Item"
3. Fill out the form with test data
4. Submit
5. Go to "Browse" section - your item should appear

#### Option 2: Use API Endpoint
```bash
# Create a test item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "lost",
    "title": "Test Item",
    "category": "Electronics",
    "date": "2024-09-08",
    "location": "Library",
    "description": "Test item to verify database connectivity"
  }'

# Retrieve all items (should include your test item)
curl http://localhost:3000/api/items
```

### Test 4: Verify Docker Containers

In a new terminal:
```bash
docker-compose ps
```

You should see output showing both containers running:
```
NAME                COMMAND                  SERVICE    STATUS
sit725-app          docker-entrypoint.s…     app        Up 1 minute
sit725-mongodb      mongosh localhost:27…    mongodb    Up 1 minute
```

---

## Stopping the Application

To stop the application, press `Ctrl+C` in the terminal, or run:

```bash
docker-compose down
```

**Note:** Your data in MongoDB will persist. To delete all data:
```bash
docker-compose down -v
```

---

## API Endpoints

### 1. Frontend (HTML Pages)
- **GET** `/` - Home page
- **GET** `/report.html` - Report new lost/found item
- **GET** `/browse.html` - Browse all items
- **GET** `/search-filter.html` - Search and filter items

### 2. API Endpoints

#### GET /api/items
Retrieve all lost and found items

```bash
curl http://localhost:3000/api/items
```

Response:
```json
[
  {
    "id": 1,
    "type": "lost",
    "title": "Blue Backpack",
    "category": "Bags",
    "date": "2024-09-08",
    "location": "Library",
    "description": "Lost blue backpack with laptop"
  }
]
```

#### POST /api/items
Report a new lost or found item

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "lost",
    "title": "Blue Backpack",
    "category": "Bags",
    "date": "2024-09-08",
    "location": "Library",
    "description": "Lost blue backpack with laptop"
  }'
```

Response:
```json
{
  "message": "Report created successfully.",
  "item": {
    "id": 1,
    "type": "lost",
    "title": "Blue Backpack",
    "category": "Bags",
    "date": "2024-09-08",
    "location": "Library",
    "description": "Lost blue backpack with laptop"
  }
}
```

#### GET /api/student
Get student identification (HD submission endpoint)

```bash
curl http://localhost:3000/api/student
```

Response:
```json
{
  "name": "Your Full Name",
  "studentId": "Your Student ID"
}
```

---

## Docker Architecture

### Services

#### 1. MongoDB (Database)
- **Image:** mongo:7.0
- **Container Name:** sit725-mongodb
- **Port:** 27017 (internal) → 27017 (localhost)
- **Credentials:**
  - Username: `admin`
  - Password: `password123`
- **Database:** `sit725-group-88`
- **Health Check:** MongoDB is pinged every 10 seconds
- **Volume:** `mongodb_data` - persists data between container restarts

#### 2. Node.js App (Application Server)
- **Image:** Built from `Dockerfile`
- **Container Name:** sit725-app
- **Port:** 3000 (internal) → 3000 (localhost)
- **Environment Variables:**
  - `NODE_ENV: production`
  - `PORT: 3000`
  - `MONGODB_URI: mongodb://admin:password123@mongodb:27017/sit725-group-88?authSource=admin`
- **Depends On:** MongoDB (waits for health check to pass)
- **Volumes:**
  - `.:/app` - mounts current directory for live code updates
  - `/app/node_modules` - persists node_modules

### File Structure

```
.
├── Dockerfile                 # Application container configuration
├── docker-compose.yml         # Service orchestration configuration
├── .dockerignore             # Files excluded from Docker build context
├── server.js                 # Express server with /api/student endpoint
├── package.json              # Node.js dependencies
├── package-lock.json         # Locked dependency versions
│
├── public/                   # Frontend files served to browser
│   ├── index.html
│   ├── report.html
│   ├── browse.html
│   ├── search-filter.html
│   ├── css/
│   └── js/
│
├── models/                   # Mongoose database schemas
│   ├── user.model.js
│   ├── lostItem.model.js
│   └── foundItem.model.js
│
├── controllers/              # Business logic for API endpoints
├── routes/                   # API route definitions
├── services/                 # Reusable service functions
│
├── test/                     # Test files (not included in Docker image)
├── scripts/                  # Utility scripts
│
└── README.md                 # This file
```

---

## Configuration Details

### Docker Compose Configuration

The `docker-compose.yml` file orchestrates two services:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    # ... MongoDB configuration
    healthcheck:
      test: ...              # Ensures MongoDB is ready
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build:
      context: .
      dockerfile: Dockerfile
    # ... App configuration
    depends_on:
      mongodb:
        condition: service_healthy  # Wait for MongoDB health check
```

### Environment Variables

Configuration is passed via environment variables in `docker-compose.yml`:

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Sets application environment |
| `PORT` | `3000` | Sets Express server port |
| `MONGODB_URI` | `mongodb://admin:password123@mongodb:27017/sit725-group-88?authSource=admin` | MongoDB connection string |

### Dockerfile Strategy

The `Dockerfile` uses:
- **Base Image:** `node:18-alpine` (lightweight ~150MB)
- **Working Directory:** `/app`
- **Build Steps:**
  1. Copy package files
  2. Install dependencies
  3. Copy application code
  4. Expose port 3000
  5. Start with `node server.js`

The `.dockerignore` excludes unnecessary files to reduce build context size.

---

## Troubleshooting

### Issue: Port 3000 Already in Use

**Error:** `bind: address already in use`

**Solution 1: Kill the process using port 3000**
```bash
# On Mac/Linux
sudo lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution 2: Use a different port**

Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

Then access at http://localhost:3001

### Issue: MongoDB Connection Failed

**Error:** `MONGODB_URI is not defined` or `Connection error`

**Troubleshooting Steps:**

1. Check if MongoDB container is running:
   ```bash
   docker-compose ps mongodb
   ```

2. View MongoDB logs:
   ```bash
   docker-compose logs mongodb
   ```

3. Rebuild containers:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

4. Check MongoDB is healthy:
   ```bash
   docker exec sit725-mongodb mongosh --eval "db.adminCommand('ping')"
   ```

### Issue: Application Won't Start

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
```bash
# View application logs
docker-compose logs app

# Rebuild everything
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Issue: "Address Already in Use" for MongoDB

**Error:** `bind: address already in use` for port 27017

**Solution:**
```bash
# Stop any existing MongoDB containers
docker stop sit725-mongodb 2>/dev/null || true

# Remove dangling containers
docker container prune -f

# Start fresh
docker-compose up --build
```

---

## Docker Useful Commands

### Building and Starting

```bash
# Build images without starting
docker-compose build

# Build and start in foreground (shows logs)
docker-compose up

# Build and start in background
docker-compose up -d

# Build without cache (rebuilds from scratch)
docker-compose build --no-cache

# Build and start in one command
docker-compose up --build
```

### Viewing Status and Logs

```bash
# Show running containers
docker-compose ps

# View all logs
docker-compose logs

# View logs for specific service
docker-compose logs app
docker-compose logs mongodb

# View logs in real-time
docker-compose logs -f

# View last 50 lines of logs
docker-compose logs --tail=50
```

### Stopping and Cleanup

```bash
# Stop containers (data preserved)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything including volumes (WARNING: data deleted)
docker-compose down -v

# Remove dangling images
docker image prune -f
```

### Accessing Container Shells

```bash
# Access Node.js application shell
docker exec -it sit725-app /bin/sh

# Access MongoDB shell
docker exec -it sit725-mongodb mongosh

# Run commands in container
docker exec sit725-app npm test
```

---

## Testing

### Running Unit Tests (Inside Container)

```bash
docker exec sit725-app npm test
```

### Running Tests with Coverage

```bash
docker exec sit725-app npm run test:coverage
```

### Running Preflight Check

```bash
docker exec sit725-app npm run preflight-check
```

---

## Development Workflow

If you modify code and want changes to be reflected:

1. **Live Code Updates:** Due to volume mount (`.:/app`), changes to `.js` files are reflected immediately
2. **Dependency Changes:** If you modify `package.json`, rebuild:
   ```bash
   docker-compose down
   docker-compose up --build
   ```
3. **Database Schema Changes:** May require clearing data:
   ```bash
   docker-compose down -v
   docker-compose up
   ```

---

## Performance Notes

- **First Build:** ~2-3 minutes (installs all dependencies)
- **Subsequent Builds:** ~10-30 seconds (cached layers)
- **Container Startup:** ~15-30 seconds (MongoDB initialization)
- **Full Restart:** ~1 minute from `docker-compose down` to ready state

---

## Security Notes

### For Production (Not Applicable Here)

This configuration uses default credentials and should NOT be used in production. For production:

- Use environment-specific `.env` files
- Store secrets in a secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Use strong passwords
- Enable MongoDB authentication with user-specific roles
- Use multi-stage Docker builds to minimize image size
- Scan images for vulnerabilities

### For This Assignment

- MongoDB runs with basic authentication
- Credentials are defined in `docker-compose.yml`
- Port 27017 is exposed for testing purposes
- This is acceptable for a local development/testing environment

---

## References

- Docker Documentation: https://docs.docker.com
- Docker Compose Reference: https://docs.docker.com/compose/compose-file
- Mongoose Documentation: https://mongoosejs.com/docs
- Express.js Guide: https://expressjs.com/en/guide/routing.html
- MongoDB Docker Hub: https://hub.docker.com/_/mongo
- Node.js Docker Hub: https://hub.docker.com/_/node

---

## Student Information

- **Name:** [Your Full Name]
- **Student ID:** [Your Student ID]
- **Submission Date:** [Date]
- **GitHub Repository:** https://github.com/rezatisa/SIT725-Group-88-Campus-Lost-and-Found
- **Student Endpoint:** GET http://localhost:3000/api/student

---

## Notes

This is an individual High Distinction (HD) submission for the group Campus Lost and Found project. All Docker containerization, configuration, and individual work has been completed independently while maintaining the original group project application functionality.