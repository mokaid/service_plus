# Service Plus Backend - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Security](#authentication--security)
8. [Middleware](#middleware)
9. [Utility Functions](#utility-functions)
10. [File Upload System](#file-upload-system)
11. [Error Handling](#error-handling)
12. [Deployment](#deployment)
13. [Development Setup](#development-setup)

## Project Overview

The Service Plus Backend is a Node.js-based REST API server built with Fastify framework. It serves as a middleware/proxy between frontend applications and external service APIs, providing authentication, data filtering, session management, and file upload capabilities.

### Key Features

- **Authentication & Session Management**: User login, token refresh, and session-based authentication
- **Data Proxy**: Acts as an intermediary for external API calls with signature generation
- **File Management**: Upload, download, and manage firmware files
- **User Management**: CRUD operations for users with permission-based access control
- **Organization & Site Management**: Handle organizations, sites, and groups
- **Event Management**: Process and manage system events with filtering capabilities
- **Statistics & Analytics**: Provide chart data and event statistics
- **Data Filtering**: Site and system-based filtering for user access control

## Technology Stack

### Core Technologies

- **Node.js** (v16+) - Runtime environment
- **Fastify** (v5.2.0) - Web framework for Node.js
- **MySQL** - Database system
- **Axios** (v1.7.9) - HTTP client for external API calls

### Key Dependencies

```json
{
  "@fastify/cookie": "^11.0.1",
  "@fastify/cors": "^10.0.1",
  "@fastify/middie": "^9.0.2",
  "@fastify/multipart": "^9.0.2",
  "@fastify/mysql": "^5.0.1",
  "@fastify/session": "^11.0.2",
  "crypto-js": "^4.2.0",
  "dotenv": "^16.4.7",
  "pump": "^3.0.2",
  "safe-stable-stringify": "^2.5.0"
}
```

## Project Structure

```
backend/
├── app.js                          # Main application entry point
├── package.json                    # Project dependencies and scripts
├── README.md                       # Basic project documentation
├── config/                         # Configuration files
│   ├── axios.js                    # Axios instance configuration
│   ├── const.js                    # Application constants
│   ├── database.js                 # Database connection configuration
│   └── endpoints.js                # External API endpoints mapping
├── src/
│   ├── routes/                     # API route definitions
│   │   ├── index.js                # Route registration
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── userRoutes.js           # User management endpoints
│   │   ├── orgRoutes.js            # Organization & site management
│   │   ├── groupRoutes.js          # Group management
│   │   ├── eventsRoutes.js         # Event processing endpoints
│   │   ├── statisticsRoutes.js     # Analytics and statistics
│   │   └── uploadRoutes.js         # File upload management
│   └── middlewares/                # Custom middleware functions
│       ├── userSessionMiddleware.js # Session management middleware
│       ├── permissionsMiddleware.js # Permission checking (empty)
│       └── filtersMiddleware.js    # Data filtering middleware (empty)
├── utils/                          # Utility functions
│   ├── base64.js                   # Base64 encoding/decoding
│   ├── calculateDuration.js        # Time duration calculations
│   ├── dates.js                    # Date manipulation utilities
│   ├── generateSign.js             # API signature generation
│   ├── hashPassword.js             # Password hashing (MD5)
│   ├── helper.js                   # General helper functions
│   ├── siteFilter.js               # Site-based data filtering
│   ├── systemsFilter.js            # System-based data filtering
│   ├── userFilter.js               # User data filtering
│   └── userPostData.js             # User data processing
└── uploads/                        # File upload directory
    ├── Dosis.zip
    ├── Sacramento.zip
    └── Viga.zip
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=proxy

# External API Configuration
API_URL=https://serviceplustest.convergintapac.com
API_SECRET_KEY=your_api_secret_key
API_APP_ID=SP_PY
```

### CORS Configuration

The application is configured to allow requests from specific origins:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://86.98.85.100:3001",
  "http://86.98.85.100",
  "http://94.200.50.118",
  "http://94.200.50.118:3001",
  "http://145.223.90.99:3000",
];
```

### Session Configuration

```javascript
{
  cookieName: "user_session",
  secret: "55bbc4b8d397ee9b397de8c128413c39415b074cb6e4220389e7816a1b465143",
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 100, // 100 days
    httpOnly: true,
    sameSite: "lax"
  },
  saveUninitialized: false
}
```

## Database Schema

### Uploads Table

The application uses a MySQL database with at least one table for file uploads:

```sql
CREATE TABLE uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL,
    size BIGINT,
    boxType INT NOT NULL,
    version VARCHAR(100),
    packageType INT,
    creation_time_UTC DATETIME,
    versionNum VARCHAR(50),
    creator VARCHAR(255)
);
```

**Table Fields:**

- `id`: Primary key, auto-increment
- `fileName`: Name of the uploaded file
- `size`: File size in bytes
- `boxType`: Type of box (0 or 1)
- `version`: Version string
- `packageType`: Package type identifier
- `creation_time_UTC`: Upload timestamp
- `versionNum`: Version number string
- `creator`: User ID who uploaded the file

## API Endpoints

### Authentication Routes (`/auth`)

#### POST `/login`

Authenticates a user and creates a session.

**Request Body:**

```json
{
  "userName": "string",
  "password": "string",
  "vefcode_img": "string" (optional)
}
```

**Response:**

```json
{
  "data": {
    "token": "string",
    "user": {
      "userGuid": "string",
      "userName": "string",
      "permission": "string",
      "filter": "base64_encoded_string"
    }
  }
}
```

#### POST `/refreshToken`

Refreshes the authentication token.

**Request Body:**

```json
{
  "msgType": "RefreshToken"
}
```

#### POST `/PostUser`

Registers or updates a user.

**Request Body:**

```json
{
  "userName": "string",
  "password": "string",
  "permission": "string",
  "status": boolean,
  "remark": "string"
}
```

### User Management Routes (`/users`)

#### GET `/users`

Retrieves all users with optional organization filtering.

**Query Parameters:**

- `orgId` (optional): Organization ID to filter users

#### GET `/getAllUsers`

Retrieves all users with pagination.

#### GET `/user`

Gets current user information.

#### POST `/postUserFilter`

Sets user site filters.

#### POST `/deleteUser`

Deletes a user.

#### POST `/postUserPermissionList`

Updates user permission list.

#### GET `/getUserPermissionList`

Retrieves user permission list.

#### POST `/getSingleUserPermission`

Gets permissions for a specific user.

#### POST `/getUserAllowedSites`

Retrieves sites allowed for a user.

#### POST `/postSingleUserPermission`

Updates permissions for a single user.

### Organization & Site Management Routes (`/org`)

#### POST `/getOrganizations`

Retrieves all organizations and sites.

#### POST `/postOrganization`

Creates or updates an organization.

**Request Body:**

```json
{
  "id": "string" (optional for update),
  "name": "string",
  "remark": "string"
}
```

#### GET `/sites`

Retrieves all sites with user filtering.

#### POST `/createSite`

Creates a new site/box.

**Request Body:**

```json
{
  "boxType": "string",
  "name": "string",
  "orgId": "string"
}
```

#### POST `/deleteSite`

Deletes a site.

**Request Body:**

```json
{
  "siteId": "string"
}
```

#### POST `/restartBox`

Restarts a box/system.

#### POST `/updateioevents`

Updates IO events text.

#### POST `/getBoxStatus`

Retrieves box status information.

#### POST `/getIoEvents`

Retrieves IO events text.

#### POST `/getMaskedItemKey`

Retrieves masked item keys.

#### POST `/maskItem`

Masks an item.

#### POST `/upgradeBoxFirmware`

Upgrades box firmware.

#### POST `/deleteMaskedItem`

Deletes a masked item.

#### POST `/configureBox`

Configures a box.

#### POST `/systems`

Retrieves systems for a site.

#### POST `/devices`

Retrieves devices for a system.

#### POST `/eventCategories`

Retrieves event categories.

#### POST `/getBoxProperty`

Retrieves box properties.

#### POST `/PostOrgContacts`

Posts organization contacts.

### Group Management Routes (`/groups`)

#### POST `/postGroup`

Creates or updates a group.

**Request Body:**

```json
{
  "name": "string",
  "orgId": "string" (optional),
  "id": "string" (optional for update),
  "parentGroupId": "string" (optional)
}
```

#### POST `/deleteGroup`

Deletes a group.

### Event Management Routes (`/events`)

#### POST `/events`

Retrieves events with filtering.

**Request Body:**

```json
{
  "startTime": "string" (optional),
  "endTime": "string" (optional),
  "keyword": "string" (optional),
  "eventType": "string" (optional),
  "devices": "string" (optional),
  "pageIndex": "number" (optional),
  "pageSize": "number" (optional),
  "processed": "number" (optional),
  "sites": "array" (optional),
  "vendors": "array" (optional),
  "priority": "array" (optional)
}
```

#### POST `/processEvent`

Processes an event.

#### POST `/postProcessSingleEvent`

Processes a single event.

#### POST `/fastRecovery`

Performs fast recovery operation.

### Statistics Routes (`/statistics`)

#### GET `/getChartData`

Retrieves chart data.

#### POST `/getChartSiteSystemObjectCount`

Retrieves site system object count for charts.

#### POST `/getChartEventsCountOfOfflineHistroy`

Retrieves offline history event counts.

#### POST `/getEventsResponseTime`

Retrieves event response times.

#### POST `/getEventsCountbyStatus`

Retrieves event counts by status.

#### POST `/getEventDataTop`

Retrieves top event data.

#### POST `/getFilters`

Retrieves available filters for events.

### File Upload Routes (`/upload`)

#### POST `/upload`

Uploads a firmware file.

**Request Body:**

- `file`: ZIP file (multipart/form-data)
- `boxType`: Box type value
- `version`: Version string
- `packageType`: Package type value
- `userId`: User ID

**Response:**

```json
{
  "data": {
    "fileName": "string",
    "size": "number",
    "boxType": "number",
    "version": "string",
    "packageType": "number",
    "creation_time_UTC": "string",
    "versionNum": "string",
    "creator": "string"
  },
  "message": "string"
}
```

#### GET `/uploads`

Retrieves all uploaded files with latest version information.

#### DELETE `/upload/:id`

Deletes an uploaded file by ID.

## Authentication & Security

### Password Hashing

Passwords are hashed using MD5 algorithm:

```javascript
export async function hashPassword(password) {
  if (!password) return null;
  const hash = await crypto.createHash("md5").update(password).digest("hex");
  return hash.toLowerCase();
}
```

### API Signature Generation

The application generates signatures for external API calls using AES encryption:

```javascript
export const getSign = (url, data, timestamp) => {
  const urlParts = url.split("/");
  const lastUri =
    urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
  const bodyData = `${lastUri}.${data}.${timestamp}`;
  const bodyDataResult = CryptoJS.enc.Utf8.parse(bodyData);
  const encrypted = CryptoJS.AES.encrypt(bodyDataResult, aes_key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).ciphertext.toString();
  return CryptoJS.SHA256(encrypted).toString().toLowerCase();
};
```

### Session Management

- Sessions are stored using `@fastify/session`
- Session duration: 100 days
- Secure cookies with HTTP-only flag
- Session data includes user information and permissions

## Middleware

### User Session Middleware

Located in `src/middlewares/userSessionMiddleware.js`

- Currently only logs request information
- Can be extended for session validation

### Permission Middleware

Located in `src/middlewares/permissionsMiddleware.js`

- Currently empty, ready for permission checking implementation

### Filters Middleware

Located in `src/middlewares/filtersMiddleware.js`

- Currently empty, ready for data filtering implementation

## Utility Functions

### Base64 Utilities (`utils/base64.js`)

- `decodeBase64(base64String)`: Decodes base64 string to JSON object
- `encodeBase64(jsonObject)`: Encodes JSON object to base64 string

### Date Utilities (`utils/dates.js`)

- `getLastWeekDate(date)`: Gets date from last week
- `getLastMonthDate(date)`: Gets date from last month
- `getLast90DaysDate(date)`: Gets date from 90 days ago
- `getTodayDate(date)`: Gets today's date
- `getCurrentYear(date)`: Gets start of current year
- `formatDate(date)`: Formats date as YYYY-MM-DD

### Duration Calculation (`utils/calculateDuration.js`)

- `calculateDuration(startDateString, endDateString)`: Calculates time duration
- `sortByRectificationTime(arr)`: Sorts array by rectification time
- `convertDurationToMinutes(duration)`: Converts duration to minutes
- `convertDurationToSeconds(duration)`: Converts duration to seconds

### Filtering Utilities

- `sitesFilter(request)`: Filters data based on user's allowed sites
- `systemsFilter(request)`: Filters data based on user's allowed systems
- `userFilter(request)`: Filters user data based on session

### Helper Functions (`utils/helper.js`)

- `getLastPathSegment(path)`: Extracts last segment from URL path

### User Data Processing (`utils/userPostData.js`)

- `getUserPostData(data)`: Processes user data for API calls

## File Upload System

### Upload Directory

- Files are stored in the `uploads/` directory
- Only ZIP files are allowed
- Files are associated with box types and versions

### Database Integration

- Upload metadata is stored in the `uploads` table
- File information includes size, type, version, and creator
- Supports version tracking for different box types

### File Operations

- **Upload**: Validates file type, saves to filesystem, stores metadata
- **List**: Retrieves all uploads with latest version information
- **Delete**: Removes file from filesystem and database

## Error Handling

### Standard Error Response Format

```json
{
  "data": {
    "error": "error_code",
    "desc": "error_description"
  }
}
```

### Common Error Codes

- `1000`: General login/authentication error
- `1020`: User retrieval error
- `1021`: User session error

### Error Logging

- All errors are logged to console with detailed information
- External API errors include response data for debugging
- File operation errors include stack traces

## Deployment

### Production Considerations

1. **Environment Variables**: Ensure all required environment variables are set
2. **Database**: Configure production MySQL database
3. **CORS**: Update allowed origins for production domains
4. **HTTPS**: Enable secure cookies in production
5. **File Storage**: Ensure upload directory has proper permissions
6. **Logging**: Implement proper logging for production

### Server Configuration

- **Port**: 5001 (configurable)
- **Host**: 0.0.0.0 (accepts connections from any IP)
- **CORS**: Configured for specific origins
- **Session**: 100-day session duration

## Development Setup

### Prerequisites

- Node.js v16+
- MySQL database
- npm package manager

### Installation Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Set up MySQL database with `uploads` table
5. Start the server: `npm start`

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# The server will run on http://localhost:5001
```

### Testing

- The application includes basic error handling and logging
- Test endpoints using tools like Postman or curl
- Monitor console logs for debugging information

### File Structure for Development

- Routes are organized by functionality
- Utilities are separated for reusability
- Configuration is centralized in `config/` directory
- Middleware can be extended for additional functionality

---

## Additional Notes

### Security Considerations

- Passwords are hashed using MD5 (consider upgrading to bcrypt)
- API signatures use AES encryption
- Sessions are secured with HTTP-only cookies
- CORS is configured for specific origins

### Performance Considerations

- Database connections are managed by Fastify MySQL plugin
- File uploads use streaming for large files
- API responses are cached where appropriate
- Error handling prevents server crashes

### Scalability

- Stateless design allows horizontal scaling
- Database connections are pooled
- File storage can be moved to cloud storage
- Session storage can be moved to Redis

This documentation provides a comprehensive overview of the Service Plus Backend project, including all technical details, API endpoints, database schema, and development guidelines.
