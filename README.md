# KSRTC Bus Information System

A full-stack web application developed to provide users with easy access to KSRTC bus routes, schedules, and transportation details. The system enables passengers to search for bus information while providing administrators with a secure dashboard to manage buses, places, and user queries.

## Project Overview

The KSRTC Bus Information System is designed to digitize bus information management and improve accessibility for passengers. Users can search routes and view timetables without authentication, while administrators can securely manage system data through an admin panel. The application follows a three-tier architecture using MongoDB, Express.js, Node.js, and React. 

## Features

### User Features
- View bus routes and schedules
- Search buses by source and destination
- View timetable information
- Submit queries through the Contact Us page

### Admin Features
- Secure admin login
- Manage places (Add/Delete)
- Manage bus details
- View user queries
- Perform CRUD operations on transportation data

## Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

## System Architecture

The application follows a Three-Tier Architecture:

1. Presentation Layer (Frontend)
   - User Interface
   - Admin Dashboard
   - REST API Integration

2. Application Layer (Backend)
   - Authentication
   - Business Logic
   - REST APIs

3. Data Layer (Database)
   - MongoDB Collections
   - Data Storage and Retrieval

## Database Collections

### Admin
```json
{
  "username": "string",
  "password": "string"
}
```

### Place
```json
{
  "place_name": "string"
}
```

### Bus
```json
{
  "route": "string",
  "timing": "string",
  "source": "string",
  "destination": "string"
}
```

### Query
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/admin/login | Admin Login |

### Places

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/place | Get All Places |
| POST | /api/place/add | Add Place |

### Buses

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/bus | Get All Buses |
| POST | /api/bus/add | Add Bus |

## Installation

### Clone Repository

```bash
git clone https://github.com/PrathapCodes/ksrtc-bus-information-system.git
cd ksrtc-bus-information-system
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
```

Run Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Screenshots

### Home Page
Add screenshot here

### Timetable Page
Add screenshot here

### Contact Page
Add screenshot here

### Admin Dashboard
Add screenshot here

## Future Enhancements

- Online Ticket Booking
- Real-Time Bus Tracking
- Seat Availability Information
- User Authentication
- Mobile Application Support

## Project Outcomes

- Implemented RESTful APIs using Express.js
- Integrated MongoDB database using Mongoose
- Developed secure admin authentication
- Implemented CRUD operations for buses and places
- Built responsive frontend interfaces

## Author

**Prathapa V**
- Ramaiah Institute of Technology
- Computer Science & Engineering

## License

MIT License
