# Fuel Tracker - Deployment Guide

This guide provides comprehensive instructions for deploying the Fuel Tracker application in different environments.

## Table of Contents

1. [Quick Start (Local Development)](#quick-start-local-development)
2. [Production Deployment Options](#production-deployment-options)
3. [Environment Variables](#environment-variables)
4. [Database Management](#database-management)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start (Local Development)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (20.10.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0.0 or higher)
- [Git](https://git-scm.com/downloads)

### Running Locally

```bash
# Clone the repository
git clone <repository-url>
cd fuel-tracker

# Start all services (Frontend + API + Database)
docker compose up

# Or run in detached mode
docker compose up -d
```

**That's it!** The application will be available at:

- **Application**: http://localhost:8080
- **Supabase Studio** (Admin UI): http://localhost:54323
- **Supabase API**: http://localhost:54321

### First-Time Setup

1. Open http://localhost:8080
2. Click "Sign Up" to create an account
3. Start adding vehicles and fuel entries

### Stopping the Application

```bash
# Stop all services (preserves data)
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```

### Viewing Logs

```bash
# View all logs
docker compose logs

# View logs for specific service
docker compose logs app
docker compose logs db

# Follow logs in real-time
docker compose logs -f
```

---

## Production Deployment Options

### Option A: Cloud Deployment (Recommended)

**Best for:** Quick deployment, automatic scaling, minimal maintenance

#### Frontend: Vercel

1. **Fork/Push to GitHub**
   ```bash
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables in Vercel**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

#### Backend: Supabase Cloud

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Note your project URL and anon key

2. **Apply Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Push migrations
   supabase db push
   ```

3. **Configure Authentication**
   - Go to Authentication → Settings
   - Add your production URL to "Site URL"
   - Configure email templates if needed

**Total deployment time:** ~10 minutes

---

### Option B: Self-Hosted with Docker

**Best for:** Full control, custom infrastructure, data sovereignty

#### Prerequisites

- Linux server (Ubuntu 22.04 recommended)
- Docker & Docker Compose installed
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

#### Deployment Steps

1. **Clone Repository on Server**
   ```bash
   git clone <repository-url>
   cd fuel-tracker
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

3. **Update docker-compose.yml for Production**
   ```yaml
   # Change GOTRUE_SITE_URL to your domain
   GOTRUE_SITE_URL: https://yourdomain.com
   
   # Update API_EXTERNAL_URL
   API_EXTERNAL_URL: https://yourdomain.com
   ```

4. **Set Up Reverse Proxy (Nginx)**
   ```nginx
   # /etc/nginx/sites-available/fuel-tracker
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api/ {
           proxy_pass http://localhost:54321/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

6. **Start Services**
   ```bash
   docker compose up -d
   ```

7. **Set Up Automatic Backups**
   ```bash
   # Create backup script
   cat > backup.sh << 'EOF'
   #!/bin/bash
   docker exec fuel-tracker-db pg_dump -U postgres postgres > backup-$(date +%Y%m%d-%H%M%S).sql
   EOF

   chmod +x backup.sh

   # Add to crontab (daily at 2 AM)
   (crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
   ```

**Total deployment time:** ~30-60 minutes

---

### Option C: Manual Deployment

**Best for:** Custom infrastructure, specific requirements

#### Frontend Deployment

1. **Build the Application**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy dist/ folder** to your hosting provider:
   - Upload to S3 + CloudFront
   - Deploy to Netlify
   - Copy to your web server

#### Backend Deployment

1. **Set Up PostgreSQL Database**
   - Install PostgreSQL 15+
   - Create database: `CREATE DATABASE fuel_tracker;`

2. **Apply Migrations**
   ```bash
   # Using psql
   psql -U postgres -d fuel_tracker -f supabase/migrations/*.sql
   ```

3. **Set Up Supabase Services**
   - Follow [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting)
   - Configure GoTrue for authentication
   - Configure PostgREST for API
   - Configure Storage API for file uploads

---

## Environment Variables

### Development (Docker Local)

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### Production (Supabase Cloud)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Getting Production Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy "URL" and "anon public" key

---

## Database Management

### Migrations

All database migrations are stored in `supabase/migrations/` and are automatically applied when using Docker.

#### Creating New Migrations

```bash
# Using Supabase CLI
supabase migration new add_new_feature

# Edit the generated file
nano supabase/migrations/<timestamp>_add_new_feature.sql

# Apply locally
supabase db reset

# Push to production
supabase db push
```

### Backups

#### Docker Local Environment

```bash
# Create backup
docker exec fuel-tracker-db pg_dump -U postgres postgres > backup.sql

# Restore backup
docker exec -i fuel-tracker-db psql -U postgres postgres < backup.sql
```

#### Supabase Cloud

1. Go to your project dashboard
2. Click "Database" → "Backups"
3. Configure automatic daily backups
4. Download backups as needed

### Resetting Database

```bash
# Docker local
docker compose down -v
docker compose up

# This will reset the database and reapply all migrations
```

---

## Troubleshooting

### Common Issues

#### Port Conflicts

**Error:** `Bind for 0.0.0.0:8080 failed: port is already allocated`

**Solution:**
```bash
# Find process using port
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "8081:80"  # Use port 8081 instead
```

#### Database Connection Issues

**Error:** `connection to server at "db" failed`

**Solution:**
```bash
# Check database logs
docker compose logs db

# Restart database
docker compose restart db

# If persistent, remove volumes and restart
docker compose down -v
docker compose up
```

#### Migration Errors

**Error:** `relation "profiles" already exists`

**Solution:**
```bash
# Reset database and reapply migrations
docker compose down -v
docker compose up
```

#### Build Fails

**Error:** `ENOENT: no such file or directory`

**Solution:**
```bash
# Clean install dependencies
rm -rf node_modules
npm install

# Rebuild Docker image
docker compose build --no-cache app
docker compose up
```

### Getting Help

1. Check [GitHub Issues](repository-url/issues)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Join [Supabase Discord](https://discord.supabase.com)

---

## Performance Optimization

### Production Recommendations

1. **Enable Caching**
   - Use CDN for static assets
   - Configure browser caching headers
   - Enable Nginx caching

2. **Database Optimization**
   - Add indexes for frequently queried columns
   - Enable connection pooling (PgBouncer)
   - Regular VACUUM and ANALYZE

3. **Monitoring**
   - Set up Sentry for error tracking
   - Configure Prometheus for metrics
   - Use Supabase Dashboard for query analysis

---

## Security Checklist

- [ ] SSL/TLS enabled (HTTPS)
- [ ] Environment variables not committed to Git
- [ ] Row Level Security (RLS) policies enabled
- [ ] Regular database backups configured
- [ ] Strong JWT secret (change default in production)
- [ ] Email confirmation enabled for signups
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled

---

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Deploy multiple app containers
- Use managed database with read replicas

### Vertical Scaling

- Increase database resources
- Optimize queries and add indexes
- Enable caching layers (Redis)

---

For additional help, see [HANDOVER.md](./HANDOVER.md) for client-specific deployment instructions.
