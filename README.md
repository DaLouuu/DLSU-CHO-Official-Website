# DLSU Chorale Attendance System

Official attendance management system for DLSU Chorale members.

## Overview

A modern web application for managing member attendance, excuse requests, and administrative tasks for the DLSU Chorale organization.

---

## Running the Website Locally with Docker

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Quick Start

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd DLSU-CHO-Official-Website
   ```

2. **Create environment file** (optional, but recommended):
   ```bash
   cp env.example .env
   ```
   
   The `.env` file is already configured with default values, but you can customize them if needed.

3. **Start the development server**:
   ```bash
   docker compose up
   ```
   
   Or run in detached mode (background):
   ```bash
   docker compose up -d
   ```

4. **Open your browser**:
   - Main page: [http://localhost:3000](http://localhost:3000)
   - Register page: [http://localhost:3000/register](http://localhost:3000/register)
   - Attendance form: [http://localhost:3000/attendance-form](http://localhost:3000/attendance-form)

### Hot Reload

The Docker setup supports **hot reload** - any changes you make to the source code will automatically refresh in the browser. No need to restart the container!

### Stopping the Containers

To stop the development server:
```bash
docker compose down
```

To stop and remove volumes (clean slate):
```bash
docker compose down -v
```

### Rebuilding the Container

If you make changes to `Dockerfile.dev` or `package.json`, rebuild the container:
```bash
docker compose build
docker compose up
```

Or rebuild and start in one command:
```bash
docker compose up --build
```

### Viewing Logs

To view the application logs:
```bash
docker compose logs -f
```

### Common Troubleshooting

**Port 3000 already in use:**
- Stop any other services running on port 3000, or
- Change the port mapping in `docker-compose.yml` (e.g., `"3001:3000"`)

**Container won't start:**
- Check Docker is running: `docker ps`
- Rebuild the container: `docker compose build --no-cache`
- Check logs: `docker compose logs`

**Changes not reflecting:**
- Ensure volumes are properly mounted in `docker-compose.yml`
- Try restarting: `docker compose restart`

**Permission errors (Linux/Mac):**
- Ensure Docker has proper permissions
- Try: `sudo docker compose up` (not recommended for production)

### Development vs Production

- **Development**: Uses `Dockerfile.dev` with hot reload enabled
- **Production**: Uses `Dockerfile` with optimized build (set `DOCKER_BUILD=true` environment variable)

---

## Running the Website Locally

### Prerequisites

- **Node.js 20+** installed ([Download](https://nodejs.org/))
- **pnpm** installed (`npm install -g pnpm`)

### Setup Steps

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Create environment file** (required for Supabase):
   
   A `.env.local` file has been created automatically with the required Supabase configuration.
   If you need to recreate it, create a file named `.env.local` in the project root with:
   
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://sstmwvnstzwaopqjkurm.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzdG13dm5zdHp3YW9wcWprdXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjM2ODcsImV4cCI6MjA2MjA5OTY4N30.owoNICStx_2uejWtHjHvcZmq-5i5vn_62SSQLtQBKMA
   RESEND_API_KEY=re_VGFWxY7Z_BtYWLnAcjMywb2NVkGXou3fj
   EMAIL_FROM=DLSU Chorale <noreply@dlsuchorale.com>
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**: 
   - Main page: [http://localhost:3000](http://localhost:3000)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Register: [http://localhost:3000/register](http://localhost:3000/register)
   - Attendance Form: [http://localhost:3000/attendance-form](http://localhost:3000/attendance-form)

### Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

### Common Errors

**"Missing Supabase environment variables" or middleware errors:**
- Ensure `.env.local` exists in the project root
- Restart the dev server after creating/updating `.env.local`
- Check that variable names match exactly (case-sensitive)

**Port 3000 already in use:**
- Stop other services using port 3000, or
- Run on a different port: `pnpm dev -- -p 3001`

**Module not found errors:**
- Delete `node_modules` and `.next` folders
- Run `pnpm install` again
- Restart the dev server

## Webpage Addresses

- **Home/Register Page**: [http://localhost:3000](http://localhost:3000)
- **Login Page**: [http://localhost:3000/login](http://localhost:3000/login)
- **Attendance Form**: [http://localhost:3000/attendance-form](http://localhost:3000/attendance-form)
- **Attendance Overview**: [http://localhost:3000/attendance-overview](http://localhost:3000/attendance-overview)
- **Profile**: [http://localhost:3000/profile](http://localhost:3000/profile)
- **Settings**: [http://localhost:3000/settings](http://localhost:3000/settings)

