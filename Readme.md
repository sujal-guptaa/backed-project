# Backend Project - Video Platform API

A robust Node.js/Express backend API for a YouTube-like video platform. This project provides comprehensive endpoints for user authentication, video management, social features (comments, likes), playlists, tweets, subscriptions, and dashboard analytics.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Register and login with secure JWT-based authentication
- **Video Management**: Create, retrieve, update, and delete videos with publish status control
- **Social Features**: Comments, likes, subscriptions, and tweet functionality
- **Playlists**: Create and manage video playlists
- **Media Handling**: Integration with Cloudinary for image and video uploads
- **Dashboard Analytics**: User engagement and platform statistics
- **Health Monitoring**: Server health check endpoint for monitoring
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (implied from structure)
- **Media Storage**: Cloudinary
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Management**: dotenv

## Project Structure

```
backed-project/
├── models/              # Database models
│   ├── User.js
│   ├── Video.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Playlist.js
│   ├── Tweet.js
│   └── Subscription.js
├── controllers/         # Business logic controllers
│   ├── auth.js
│   ├── user.js
│   ├── video.js
│   ├── comment.js
│   ├── like.js
│   ├── playlist.js
│   ├── tweet.js
│   ├── subscription.js
│   ├── dashboard.js
│   └── healthCheck.js
├── routes/              # API route definitions
│   └── [route files]
├── middleware/          # Custom middleware
├── utils/               # Utility functions
├── config/              # Configuration files
└── server.js           # Main application entry point
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Cloudinary account (for media uploads)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sujal-guptaa/backed-project.git
   cd backed-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Cloudinary (for media uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (if applicable)
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

**Note**: Never commit your `.env` file to version control. Add cloud provider credentials (Cloudinary, AWS, etc.) as needed for your deployment environment.

## Running the Application

### Development Mode
Start the application with auto-reload (using nodemon):
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will typically run at `http://localhost:4000` or the `PORT` you configured in your `.env` file.

### Health Check
Verify the server is running:
```bash
curl http://localhost:4000/api/health-check
```

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response** (includes JWT token):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "john_doe", "email": "john@example.com" }
}
```

### Videos

#### Get All Videos
```http
GET /api/videos
```

#### Get Video by ID
```http
GET /api/videos/:id
```

#### Create Video
```http
POST /api/videos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Video",
  "description": "Video description",
  "videoUrl": "cloudinary_url",
  "thumbnail": "cloudinary_thumbnail_url"
}
```

#### Update Video
```http
PUT /api/videos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "isPublished": true
}
```

#### Toggle Video Publish Status
```http
PATCH /api/videos/:id/toggle-publish
Authorization: Bearer <token>
```

#### Delete Video
```http
DELETE /api/videos/:id
Authorization: Bearer <token>
```

### Comments

#### Add Comment to Video
```http
POST /api/videos/:videoId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great video!"
}
```

#### Get All Comments for Video
```http
GET /api/videos/:videoId/comments
```

### Likes

#### Like a Video
```http
POST /api/videos/:videoId/likes
Authorization: Bearer <token>
```

#### Unlike a Video
```http
DELETE /api/likes/:likeId
Authorization: Bearer <token>
```

### Playlists

#### Create Playlist
```http
POST /api/playlists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Playlist",
  "description": "Playlist description"
}
```

#### Get Playlist by ID
```http
GET /api/playlists/:id
```

#### Update Playlist
```http
PATCH /api/playlists/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Playlist Name",
  "description": "Updated description"
}
```

### Users

#### Get User Profile
```http
GET /api/users/:userId
```

#### Update User Profile
```http
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: multipart/form-data

- avatar (image file)
- coverImage (image file)
- fullName (text)
- bio (text)
```

### Subscriptions

#### Subscribe to User
```http
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "channelId": "user_id_to_subscribe"
}
```

### Tweets

#### Create Tweet
```http
POST /api/tweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Tweet content"
}
```

### Dashboard

#### Get User Dashboard
```http
GET /api/dashboard
Authorization: Bearer <token>
```

## Testing

### Run Tests
```bash
npm test
```

### Add Test Coverage
The project uses Jest or Mocha/Chai for testing. As you expand the project, add test files in a `__tests__` or `tests` directory:

```bash
npm install --save-dev jest supertest
```

Example test:
```javascript
const request = require('supertest');
const app = require('../server');

describe('Videos API', () => {
  it('should fetch all videos', async () => {
    const res = await request(app).get('/api/videos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

## Contributing

Contributions, issues, and feature requests are welcome! For larger changes, please open an issue first to discuss what you would like to change.

### Steps to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/sujal-guptaa/backed-project.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**
   ```bash
   git commit -m "Add your feature: brief description"
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues

## License

This project is for learning purposes. Add a license file (e.g., MIT) if you want to permit reuse.

---

**Author**: [Sujal](https://github.com/sujal-guptaa)  
**Repository**: [backed-project](https://github.com/sujal-guptaa/backed-project)
