# 🚨 Incident Tracker API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Incidents](#incidents)
3. [Comments](#comments)
4. [Analytics](#analytics)

---

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen"  // optional: "citizen", "responder", "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "citizen",
      "reputation": 0,
      "incidentsReported": 0,
      "incidentsVerified": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

---

### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "reputation": 5,
    "incidentsReported": 3,
    "incidentsVerified": 12
  }
}
```

---

## 🚨 Incidents

### Create Incident
```http
POST /api/incidents
```

**Headers (Optional):**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "accident",  // accident, fire, medical, infrastructure, safety, other
  "title": "Car accident on Main Street",
  "description": "Two-car collision blocking traffic",
  "location": {
    "coordinates": [77.5946, 12.9716],  // [longitude, latitude]
    "address": "Main Street, Bangalore"
  },
  "media": [
    {
      "type": "image",
      "url": "https://example.com/image.jpg"
    }
  ],
  "reporter": {
    "name": "Anonymous",  // optional if authenticated
    "contact": "9876543210"  // optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "accident",
    "title": "Car accident on Main Street",
    "description": "Two-car collision blocking traffic",
    "location": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716],
      "address": "Main Street, Bangalore"
    },
    "severity": "medium",
    "status": "reported",
    "verificationCount": 0,
    "priority": 7,
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  },
  "possibleDuplicates": []  // Array of similar incidents if found
}
```

---

### Get All Incidents
```http
GET /api/incidents?type=accident&status=reported&limit=20&page=1&sort=-createdAt
```

**Query Parameters:**
- `type` (optional): accident, fire, medical, infrastructure, safety, other
- `status` (optional): reported, verified, in-progress, resolved, false
- `severity` (optional): low, medium, high, critical
- `limit` (optional): Number of results (default: 50)
- `page` (optional): Page number (default: 1)
- `sort` (optional): Sort field (default: -createdAt)

**Response:**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "accident",
      "title": "Car accident on Main Street",
      // ... full incident object
    }
  ]
}
```

---

### Get Single Incident
```http
GET /api/incidents/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... full incident object with populated fields
  }
}
```

---

### Update Incident (Admin/Responder only)
```http
PUT /api/incidents/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "in-progress",  // reported, verified, in-progress, resolved, false
  "severity": "high",        // low, medium, high, critical
  "assignedTo": "507f1f77bcf86cd799439012"  // User ID
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... updated incident
  }
}
```

---

### Verify/Upvote Incident
```http
POST /api/incidents/:id/verify
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... incident with updated verification count
  }
}
```

---

### Get Nearby Incidents
```http
GET /api/incidents/nearby?longitude=77.5946&latitude=12.9716&maxDistance=5000&type=accident
```

**Query Parameters:**
- `longitude` (required): Longitude coordinate
- `latitude` (required): Latitude coordinate
- `maxDistance` (optional): Max distance in meters (default: 5000)
- `type` (optional): Filter by incident type
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    // ... array of nearby incidents
  ]
}
```

---

### Add Admin Note (Admin/Responder only)
```http
POST /api/incidents/:id/notes
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "note": "Fire department dispatched to location"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... incident with new admin note
  }
}
```

---

### Delete Incident (Admin only)
```http
DELETE /api/incidents/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 💬 Comments

### Get Comments for Incident
```http
GET /api/incidents/:incidentId/comments
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "incidentId": "507f1f77bcf86cd799439011",
      "userId": {
        "name": "John Doe",
        "role": "citizen",
        "reputation": 10
      },
      "content": "I can confirm this incident, I was there",
      "createdAt": "2025-12-28T10:05:00.000Z"
    }
  ]
}
```

---

### Add Comment
```http
POST /api/incidents/:incidentId/comments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Traffic has been cleared"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... new comment object
  }
}
```

---

### Delete Comment
```http
DELETE /api/comments/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

---

## 📊 Analytics

### Get Statistics (Admin/Responder only)
```http
GET /api/analytics/stats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncidents": 247,
    "totalUsers": 532,
    "recentIncidents": 18,
    "avgResponseTimeHours": "2.45",
    "byStatus": [
      { "_id": "reported", "count": 45 },
      { "_id": "verified", "count": 32 },
      { "_id": "in-progress", "count": 15 },
      { "_id": "resolved", "count": 150 },
      { "_id": "false", "count": 5 }
    ],
    "byType": [
      { "_id": "accident", "count": 89 },
      { "_id": "fire", "count": 23 },
      { "_id": "medical", "count": 56 }
      // ... etc
    ]
  }
}
```

---

### Get Trends (Admin/Responder only)
```http
GET /api/analytics/trends?days=7
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 7)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": {
        "date": "2025-12-28",
        "type": "accident"
      },
      "count": 12
    }
    // ... more trend data
  ]
}
```

---

### Get Heatmap Data
```http
GET /api/analytics/heatmap?type=accident&status=reported
```

**Query Parameters:**
- `type` (optional): Filter by incident type
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "type": "accident",
      "severity": "high",
      "weight": 2
    }
    // ... more points for heatmap
  ]
}
```

---

## 🔒 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access

- **Public**: Create incident (anonymous or authenticated), get incidents, get comments
- **Citizen**: All public + verify incidents, add comments
- **Responder**: All citizen + update incidents, add admin notes, view analytics
- **Admin**: All responder + delete incidents, delete any comments, user management

---

## 📝 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with cURL

### Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Create an incident
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "type":"accident",
    "title":"Test Incident",
    "description":"This is a test",
    "location":{"coordinates":[77.5946,12.9716],"address":"Test Location"}
  }'
```

### Get all incidents
```bash
curl http://localhost:5000/api/incidents
```

---

**API Version:** 2.0.0  
**Last Updated:** December 28, 2025
