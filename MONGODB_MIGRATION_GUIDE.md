# MongoDB Migration Guide - Bus Info System

## Overview
Your Bus Info System backend has been successfully migrated from MySQL to MongoDB. This guide explains all the changes made.

## What Changed?

### 1. **Database Connection** (`db.js`)
- **Before:** Used `mysql2/promise` with connection pooling
- **After:** Uses `mongoose` for MongoDB connection
- Environment variable changed from `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` to `MONGODB_URI`

### 2. **Data Models** (New `models/` directory)
Instead of SQL tables, you now have Mongoose schemas:

#### `models/Admin.js`
- Fields: `username` (unique), `password`
- Timestamps: `createdAt`, `updatedAt` (automatic)

#### `models/Place.js`
- Fields: `name` (unique)
- Timestamps: `createdAt`, `updatedAt` (automatic)

#### `models/Bus.js`
- Fields: 
  - `from_place_id` (ObjectId reference to Place)
  - `to_place_id` (ObjectId reference to Place)
  - `class_of_service` (string)
  - `via_places` (string)
  - `departure_time` (string/time)
- Timestamps: `createdAt`, `updatedAt` (automatic)

#### `models/Query.js`
- Fields:
  - `user_email` (required)
  - `user_name` (optional)
  - `query_subject` (optional)
  - `query_message` (required)
  - `is_read` (boolean, default: false)
- Timestamps: `createdAt`, `updatedAt` (automatic)

### 3. **API Routes** (Updated all route files)
All routes now use Mongoose operations instead of SQL queries:

- **`routes/auth.js`:** Uses `Admin.findOne()` for login
- **`routes/places.js`:** Uses `Place.find()`, `Place.save()`, `Place.findByIdAndDelete()`
- **`routes/buses.js`:** Uses `Bus.find()`, `Bus.save()`, `Bus.findByIdAndDelete()` with `.populate()` for relationships
- **`routes/queries.js`:** Uses `Query.find()`, `Query.save()`, `Query.countDocuments()`, `Query.findByIdAndUpdate()`

### 4. **Database Seeding** (`seed.js`)
- **Before:** SQL file (`sql/seed.sql`)
- **After:** JavaScript script (`seed.js`)
- Run with: `npm run seed`

### 5. **Package Dependencies**
```json
// Removed
"mysql2": "^3.2.0"

// Added
"mongoose": "^7.0.0"
```

## Setup Instructions

### 1. Install MongoDB
**Windows:**
- Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
- Run MongoDB:
  ```powershell
  mongod
  ```

**Alternative: Use MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Add to `.env`: `MONGODB_URI=mongodb+srv://...`

### 2. Install Dependencies
```powershell
cd backend
npm install
```

### 3. Create `.env` File
Create `.env` in the `backend` directory:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/businfo
PORT=4000
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/businfo?retryWrites=true&w=majority
PORT=4000
```

### 4. Seed the Database
```powershell
npm run seed
```

This will:
- Create the database
- Add default admin (username: admin, password: admin123)
- Add 4 places (Bengaluru, Mysuru, Tumakuru, Hassan)
- Add 4 sample buses with routes

### 5. Start the Server
```powershell
npm start      # Production
npm run dev    # Development with auto-reload
```

## Key Differences: MongoDB vs MySQL

| Aspect | MySQL | MongoDB |
|--------|-------|---------|
| **ID Field** | `id` (INT) | `_id` (ObjectId) |
| **Relationships** | Foreign keys | References (ObjectId) + `.populate()` |
| **Data Type** | Strictly typed columns | Flexible documents |
| **Timestamps** | Manual (TIMESTAMP DEFAULT) | Automatic with Mongoose |
| **Queries** | SQL syntax | Mongoose methods |
| **Transactions** | Native support | Requires sessions |
| **Scaling** | Vertical | Horizontal (Sharding) |

## API Response Changes

### Buses Endpoint
**Before (MySQL):**
```json
{
  "busid": 1,
  "from_id": 1,
  "from_name": "Bengaluru",
  "to_id": 2,
  "to_name": "Mysuru"
}
```

**After (MongoDB):**
```json
{
  "busid": "507f1f77bcf86cd799439011",  // ObjectId as string
  "from_id": "507f1f77bcf86cd799439012",
  "from_name": "Bengaluru",
  "to_id": "507f1f77bcf86cd799439013",
  "to_name": "Mysuru"
}
```

The response format is the same for frontend compatibility!

## Common Operations

### Add a Place
```javascript
// POST /api/places
{
  "name": "Coorg"
}
```

### Add a Bus
```javascript
// POST /api/buses
{
  "from_place_id": "507f1f77bcf86cd799439011",
  "to_place_id": "507f1f77bcf86cd799439012",
  "class_of_service": "AC",
  "via_places": "Chikamagalur",
  "departure_time": "10:30:00"
}
```

### Get Buses
```
GET /api/buses                 // All buses
GET /api/buses?from=Bengaluru&to=Mysuru  // Filtered buses
GET /api/buses/timetable/:placeId        // Timetable for a place
```

## Troubleshooting

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**
- MongoDB is not running. Start `mongod` first.

**Error: "ValidationError: username: Path `username` is required"**
- Missing required field in request. Check API documentation.

**ObjectId in Frontend**
- MongoDB ObjectIds are strings (auto-converted). Your frontend doesn't need changes!

## No Frontend Changes Required!
Your React/Vite frontend (`frontend/`) works without modifications because:
- API responses maintain the same structure
- ObjectIds are automatically converted to strings
- No breaking changes in endpoints

## Optional: Use MongoDB Compass for GUI
Download MongoDB Compass (GUI tool) to visualize your database:
https://www.mongodb.com/products/compass

## Reverting to MySQL
If you need to go back to MySQL:
1. Restore the old files from git history
2. Run `npm install mysql2`
3. Restore SQL schema and seed files

---

**Migration completed successfully!** 🎉
Your backend is now using MongoDB with Mongoose ODM.
