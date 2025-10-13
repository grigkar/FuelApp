# Backend Integration Guide

This document explains how the frontend is structured for backend integration with your Java/Spring/Postgres stack (or Directus REST API).

## Current Status

✅ **Completed:**
- Full React/TypeScript frontend with all MVP screens
- Complete data model matching your README requirements
- Mock Directus-style API responses for development
- All calculation logic (consumption, costs, rolling stats)
- Form validation and error handling
- Responsive UI with charts and statistics
- Authentication flow (currently mock)
- User preferences and settings management

⚠️ **Currently Using Mock Data:**
- All API calls in `src/lib/api.ts` use mock data
- Authentication is simulated (no real backend calls)
- Data persists only in `localStorage` for session

## Architecture

### API Service Layer (`src/lib/api.ts`)

The API service is designed to match Directus REST conventions but will work with any REST API:

```typescript
// Current structure - easy to replace with real API calls
export const vehicleApi = {
  async getAll(): Promise<DirectusListResponse<Vehicle>> {
    // Currently returns mock data
    // Replace with: fetch(`${API_BASE_URL}/items/vehicle`)
  },
  async create(vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">) {
    // Replace with: POST to ${API_BASE_URL}/items/vehicle
  },
  // ... other methods
};
```

### Expected API Endpoints

Your backend should implement these endpoints:

#### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/logout` - Logout current user
- `GET /api/auth/me` - Get current user info

#### Vehicles
- `GET /api/items/vehicle` - List all vehicles for current user
- `GET /api/items/vehicle/:id` - Get single vehicle
- `POST /api/items/vehicle` - Create new vehicle
- `PATCH /api/items/vehicle/:id` - Update vehicle
- `DELETE /api/items/vehicle/:id` - Delete vehicle

#### Fuel Entries
- `GET /api/items/fuel_entry` - List fuel entries
  - Supports filters: `?filter[vehicle][_eq]=<id>&sort=-entry_date`
- `GET /api/items/fuel_entry/:id` - Get single entry
- `POST /api/items/fuel_entry` - Create new entry
- `PATCH /api/items/fuel_entry/:id` - Update entry
- `DELETE /api/items/fuel_entry/:id` - Delete entry

#### User Profile
- `GET /api/items/app_user/:id` - Get user profile
- `PATCH /api/items/app_user/:id` - Update user preferences

### Expected Response Format

All endpoints should return data in this format (Directus-style):

```json
// Single item
{
  "data": {
    "id": "uuid",
    "name": "My Car",
    ...
  }
}

// List of items
{
  "data": [
    { "id": "uuid", ... },
    { "id": "uuid", ... }
  ]
}
```

## Integration Steps

### Option 1: Keep Frontend Mock (Recommended for Hackathon)

1. Continue developing with mock data
2. Build your Java/Spring backend in parallel
3. Connect them once backend is ready
4. Only write integration code once

### Option 2: Integrate with Directus Now

If you want to use Directus immediately:

1. **Set up Directus instance**
   ```bash
   docker run -d \
     -p 8055:8055 \
     -e KEY=your-key \
     -e SECRET=your-secret \
     -e DB_CLIENT=postgres \
     -e DB_HOST=your-db-host \
     -e DB_PORT=5432 \
     -e DB_DATABASE=directus \
     -e DB_USER=directus \
     -e DB_PASSWORD=directus \
     directus/directus
   ```

2. **Create collections in Directus**
   - app_user
   - vehicle
   - fuel_entry

3. **Update API base URL**
   ```bash
   # In .env
   VITE_API_BASE_URL=http://localhost:8055
   ```

4. **Replace mock API calls**
   
   In `src/lib/api.ts`, replace mock implementations:

   ```typescript
   export const vehicleApi = {
     async getAll(): Promise<DirectusListResponse<Vehicle>> {
       const response = await fetch(`${API_BASE_URL}/items/vehicle`, {
         headers: {
           'Authorization': `Bearer ${getToken()}`,
         }
       });
       return response.json();
     },
     // ... implement other methods
   };
   ```

### Option 3: Connect to Your Java Backend

1. **Implement REST endpoints** in your Spring application matching the API structure above

2. **Set up CORS** in your Spring backend:
   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/api/**")
                   .allowedOrigins("http://localhost:5173")
                   .allowedMethods("GET", "POST", "PATCH", "DELETE");
       }
   }
   ```

3. **Update environment variable**:
   ```bash
   # For development
   VITE_API_BASE_URL=http://localhost:8080/api
   
   # For Docker (with Nginx proxy)
   VITE_API_BASE_URL=/api
   ```

4. **Replace API implementations** in `src/lib/api.ts`

## Docker Deployment

### Frontend (this app)

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Compose Example

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=/api
    depends_on:
      - backend

  backend:
    build: ./backend  # Your Java/Spring app
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/fueltracker
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=fueltracker
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

## Data Model Compatibility

The frontend expects this exact data structure:

### app_user
```typescript
{
  id: string;
  email: string;
  display_name?: string;
  currency: string;
  distance_unit: "km" | "mi";
  volume_unit: "L" | "gal";
  time_zone: string;
  created_at: string;
  updated_at: string;
}
```

### vehicle
```typescript
{
  id: string;
  user_id: string;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  created_at: string;
  updated_at: string;
}
```

### fuel_entry
```typescript
{
  id: string;
  user_id: string;
  vehicle_id: string;
  entry_date: string; // ISO date
  odometer: number; // in km
  station: string;
  brand: string;
  grade: string;
  liters: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## Validation Rules

The frontend implements these validations (your backend should too):

- **Odometer**: Must increase for each vehicle
- **Date**: Cannot be in the future
- **Liters & Total**: Must be positive
- **Email**: Valid email format
- **Password**: Min 8 chars, at least 1 letter and 1 number

## Testing the Integration

1. **Start your backend** on port 8080
2. **Update .env**: `VITE_API_BASE_URL=http://localhost:8080/api`
3. **Start frontend**: `npm run dev`
4. **Test each flow**:
   - Sign up / Login
   - Add a vehicle
   - Add a fill-up
   - View dashboard, history, statistics

## Notes

- All calculations (consumption, costs, etc.) are done **client-side**
- Backend only needs to store/retrieve raw data
- Frontend handles unit conversions (km/mi, L/gal)
- Date formatting and timezone handling done in frontend
