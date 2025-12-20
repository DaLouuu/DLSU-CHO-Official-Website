# DLSU Chorale Attendance System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dalouuus-projects/v0-google-oauth-registration)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/N9R8BPqtegI)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

The project is live at:

**[https://vercel.com/dalouuus-projects/v0-google-oauth-registration](https://vercel.com/dalouuus-projects/v0-google-oauth-registration)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/N9R8BPqtegI](https://v0.dev/chat/projects/N9R8BPqtegI)**

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

## Local Development (Without Docker)

### Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)

### Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Create environment file** (optional):
   ```bash
   cp env.example .env
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Open browser**: [http://localhost:3000](http://localhost:3000)

## Webpage Addresses

- **Home/Register Page**: [http://localhost:3000](http://localhost:3000)
- **Login Page**: [http://localhost:3000/login](http://localhost:3000/login)
- **Attendance Form**: [http://localhost:3000/attendance-form](http://localhost:3000/attendance-form)
- **Attendance Overview**: [http://localhost:3000/attendance-overview](http://localhost:3000/attendance-overview)

