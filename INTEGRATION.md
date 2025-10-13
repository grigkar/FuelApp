# Backend Integration Guide

This app is now connected to **Supabase** for data storage and authentication. All calculations (fuel consumption, costs, averages) are performed **client-side in JavaScript**.

## Current Status

✅ **Completed:**
- Full React/TypeScript frontend with all MVP screens
- Complete data model (profiles, vehicles, fuel_entries)
- **Supabase integration** for data persistence and authentication
- All calculation logic client-side (consumption, costs, rolling stats)
- Form validation and error handling
- Responsive UI with charts and statistics
- Real authentication flow with Supabase Auth
- User preferences and settings management
- Row Level Security (RLS) policies for data isolation

## Database Schema

The app uses three main tables in Supabase:

### profiles
- Stores user preferences (currency, units, timezone)
- Automatically created on user signup via trigger
- One-to-one relationship with auth.users

### vehicles
- User's vehicle information
- Each vehicle belongs to a user
- Used to organize fuel entries

### fuel_entries
- Individual fill-up records
- Linked to both user and vehicle
- All metrics calculated client-side from this raw data

## Environment Variables

The app uses these environment variables:

```bash
# Supabase configuration (required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Using Self-Hosted Supabase (Docker)

You can run Supabase locally or in your own infrastructure:

1. **Clone Supabase:**
   ```bash
   git clone https://github.com/supabase/supabase
   cd supabase/docker
   cp .env.example .env
   # Edit .env with your settings
   docker-compose up -d
   ```

2. **Update environment variables:**
   ```bash
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=your-local-anon-key
   ```

3. **Apply migrations:**
   - Migrations are in `supabase/migrations/`
   - Run them via Supabase CLI or SQL editor

The app will work identically with cloud or self-hosted Supabase.

## How It Works

1. **Authentication:** Uses Supabase Auth (email/password by default)
2. **Data Storage:** All CRUD operations use Supabase client (`@supabase/supabase-js`)
3. **Security:** Row Level Security (RLS) ensures users only see their own data
4. **Calculations:** All metrics (L/100km, cost/km, averages) computed in `src/lib/calculations.ts`

## Key Files

- `src/lib/api.ts` - All Supabase queries
- `src/lib/calculations.ts` - Client-side metric calculations
- `src/contexts/AuthContext.tsx` - Authentication state
- `src/contexts/UserContext.tsx` - User preferences
- `supabase/migrations/` - Database schema and RLS policies

## Docker Deployment

### Frontend + Supabase (Recommended)

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Set Supabase env vars at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker Compose with Self-Hosted Supabase

```yaml
version: '3.8'

services:
  # Your app
  frontend:
    build: 
      context: .
      args:
        VITE_SUPABASE_URL: http://supabase:8000
        VITE_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
    ports:
      - "3000:80"
    depends_on:
      - supabase

  # Supabase (simplified - use official docker-compose for production)
  supabase:
    image: supabase/postgres:latest
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d
    ports:
      - "54321:5432"

volumes:
  db-data:
```

## Data Model

The frontend uses this exact data structure (matches Supabase schema):

### profiles (app_user)
```typescript
{
  id: string; // UUID, references auth.users
  email: string;
  display_name?: string;
  currency: string; // default: "EUR"
  distance_unit: "km" | "mi"; // default: "km"
  volume_unit: "L" | "gal"; // default: "L"
  time_zone: string; // default: "Europe/Berlin"
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

## Client-Side Calculations

**Important:** All derived metrics are calculated in JavaScript (see `src/lib/calculations.ts`):

- `distance_since_last` = current odometer - previous odometer
- `unit_price` = total / liters
- `consumption_l_per_100km` = (liters / distance) × 100
- `consumption_mpg` = miles / gallons
- `cost_per_km` = total / distance
- Rolling averages for any period (e.g., last 30 days)

The database only stores **raw data** (date, odometer, liters, total). No calculations are performed server-side.

## Validation Rules

Both client and server should enforce:

- **Odometer**: Must increase for each vehicle
- **Date**: Cannot be in the future
- **Liters & Total**: Must be positive numbers
- **Email**: Valid email format
- **Password**: Min 8 chars (enforced by Supabase)

## Authentication

Uses **Supabase Auth** with:
- Email/password authentication
- Session persistence via localStorage
- Automatic token refresh
- Password reset capability

To disable email confirmation during development:
1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations"

## Testing

1. Sign up for an account
2. Add a vehicle
3. Add fuel entries
4. View dashboard, statistics, and history
5. Update user preferences in settings

All data is isolated per user via RLS policies.
