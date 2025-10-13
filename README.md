# ⛽ Fuel Tracker — MVP

A **web application** that helps drivers record fuel fill-ups and analyze consumption and costs over time.  
This README serves as the **single source of truth** for the MVP requirements, setup, and implementation guidelines.

---

## 📘 1. Overview

### Purpose
Minimum Viable Product (MVP) for a web app that enables drivers to:
- Log fuel fill-ups and related costs
- Track consumption over time
- Analyze efficiency by brand, grade, or vehicle

### High-Level Vision
Users can register, enter each fill-up (station, fuel brand/grade, liters, total paid, odometer), and view their statistics:
- Cost per liter
- Consumption (L/100 km or MPG)
- Distance per liter
- Cost per km or mi
- Rolling averages and brand comparisons

### Primary User
An **individual driver** managing their own vehicle data.  
*(Multi-car support included in MVP.)*

### Assumptions
- First entry per vehicle is a baseline (date + odometer)
- Odometer readings only increase per vehicle
- Stored in **metric units** (km, L); imperial shown as a conversion
- All fill-ups are **full fill-ups**

### Out of Scope (for MVP)
- OCR from receipts
- Shared accounts / fleet management
- Trip logging or GPS tracking
- Tax reporting or expense approvals

---

## 👥 2. Roles & Permissions

| Role | Capabilities |
|------|---------------|
| **Anonymous Visitor** | Access landing page, sign up/in flows |
| **Authenticated User** | Full CRUD on own fuel entries, vehicles, and profile; view statistics |
| **Admin (future)** | Not in MVP; use developer tools for support |

---

## ⚙️ 3. Functional Requirements

### 🔑 3.1 Authentication & Account
- Sign up with **email + password**
  - Email must be valid and unique  
  - Password: min 8 chars, ≥1 letter & 1 number  
  - Email verification **not required** for MVP  
- Sign in / Sign out  
  - Session persists until logout or expiration  

**Acceptance Criteria**
- Valid signup creates account → user is signed in  
- Logout invalidates session

---

### 👤 3.2 User Profile & Settings
- Fields: display name (optional), preferred currency, distance unit, volume unit, time zone  
- Unit system & conversions:
  - Stored data stays metric (km/L)
  - View converts to user preferences  
  - 1 US gal = 3.78541 L,  1 mi = 1.60934 km  

**Acceptance Criteria**
- Changing units updates labels & values everywhere without altering stored data

---

### 🚗 3.3 Vehicle Management (Multi-Car)
- Add / edit / delete vehicles  
- Fields: name (required), make/model, year, fuel type (optional)  
- Every fuel entry linked to one vehicle  
- Dashboard can aggregate across all vehicles  

---

### ⛽ 3.4 Fuel Entry Management
- **Create / Edit / Delete** fuel fill-ups  
- Required fields: vehicle, date, odometer, station, fuel brand & grade, liters, total amount  
- Optional: notes (max 500 chars)  
- **History View**
  - Sorted by date (desc)
  - Filters: date range, brand, grade, station, vehicle
  - Pagination / infinite scroll  
- **Validation**
  - Odometer > previous reading  
  - Positive liters and amount  
  - No future dates  
  - When inserting earlier date → re-compute metrics  

**Acceptance Criteria**
- Valid entry saved and visible in history  
- Edits & deletes recalc adjacent distances and stats

---

### 📊 3.5 Derived Metrics & Calculations

#### Per-fill computed fields
| Metric | Formula / Rule |
|---------|----------------|
| **distance_since_last** | current odometer − previous odometer |
| **unit_price** | total / liters |
| **Consumption (metric)** | (liters / distance) × 100 → L/100 km |
| **Consumption (imperial)** | distance (mi) / volume (gal) → MPG |
| **cost_per_km** | total / distance |
| **cost_per_mile** | Converted when imperial selected |

#### Aggregations
- Rolling window (30 days, configurable)  
  - Avg cost per liter  
  - Avg consumption (L/100 km or MPG)  
  - Avg distance per day  
  - Avg cost per km  
  - Total spend & distance  
- Per brand / grade: all-time averages and count of fill-ups  

#### Rounding Rules
| Field | Decimals |
|--------|-----------|
| Currency | 2 (locale-aware) |
| Volume | 2 |
| Price per liter | 2–3 (default 2) |
| Efficiency (L/100 km / MPG) | 1 |
| Distance | Integer |

**Acceptance Criteria**
- After ≥ 2 entries → app displays per-fill & rolling stats  
- Unit-system toggle switches L/100 km ↔ MPG correctly  

---

### 📈 3.6 Statistics & Dashboards

#### Overview Dashboard
- KPI cards: rolling avg consumption, avg cost per liter, total spend, total distance, avg cost per km, avg distance/day  
- Charts:  
  - Cost per liter (line)  
  - Consumption (line, L/100 km or MPG)  
- Period selector: 30 / 90 days / YTD / Custom  
- Vehicle selector: per vehicle or all  

#### Brand / Grade Comparison
| Brand × Grade | Avg cost / L | Avg consumption | # Fill-ups |

**Acceptance Criteria**
- Changing vehicle/period updates widgets & charts  
- Empty state shown if no data  

---

## 🔒 4. Non-Functional Requirements

### 4.1 Security & Privacy
- Passwords stored with strong one-way hashing  
- HTTP-only Secure cookies for sessions  
- Enforce user-data isolation in queries  
- Store only essential PII (email)  
- Support hard-delete (account removal)  
- Log auth events (sign-in, reset requests)

### 4.2 Performance
- First meaningful paint < 2 s (on typical broadband)  
- DB queries (≤ 5 000 rows) < 500 ms (p95)

### 4.3 Reliability
- User-friendly error messages (no stack traces)  
- Server errors logged with correlation IDs

### 4.4 Compliance & Legal
- Terms of Service and Privacy Policy pages  
- GDPR basics: data export (CSV) + deletion on request

### 4.5 Observability
- Structured logs with user ID (hashed) + correlation ID

### 4.6 Browser & Device Support
- Latest 2 major versions of Chrome  
- Responsive ≥ 360 px (mobile) and ≥ 1280 px (desktop)

### 4.7 Code Quality
- Readable, maintainable, consistent style  
- Avoid unsupported framework patterns  
- Keep architecture simple and secure  

---

## 🧭 5. Screens (MVP)

1. Landing / Home (logged out)  
2. Sign Up  
3. Sign In  
4. Dashboard (with vehicle selector)  
5. Vehicle List / Add / Edit / Delete  
6. Add / Edit Fill-Up  
7. History  
8. Statistics — Brand / Grade  
9. Settings / Profile  
10. Legal Pages  
11. Error Page  

---

## 🎨 6. UX Notes

- Inline validation and helper texts (e.g., auto unit price calc)  
- Sticky **“Add Fill-Up”** button  
- Tooltips for metrics (“L/100 km: lower is better”)  
- Default dashboard period: Last 30 days  
- Quick toggles (30 / 90 / YTD / Custom)  
- Vehicle selector visible in Dashboard, History, Statistics  

---

## 🧩 7. Implementation Guidelines

### Backend
- REST API (Java / Spring Boot | Node.js / NestJS | . NET)  
- Session cookies + CSRF protection  
- Data validation on server and client  
- Postgres DB with Liquibase for migrations  

### Frontend
- ReactJS or Angular 2+  
- Responsive UI  
- Client-side form validation + error feedback  

### DevOps
- Dockerized service  
- `docker-compose.yaml` starts app + DB  
- Auto apply schema and seed data  
- Baseline admin/dev users for local env  

### Code Practices
- Consistent patterns for similar features  
- Clear naming and folder structure  
- Avoid premature complexity  

---

## 🚀 8. Deployment

```bash
# Clone repository
git clone <repo-url>
cd fuel-tracker

# Run locally (API + DB)
docker compose up
