# Backend Project - Video Platform API

A robust Node.js/Express backend API for a YouTube-like video platform. This project provides comprehensive endpoints for user authentication, video management, social features (comments, likes), playlists, and more.

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
- [Acknowledgements](#acknowledgements)
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

The server typically runs at http://localhost:4000 (or the PORT you set).

## API Examples
Below are example endpoint patterns — adjust paths to match your route definitions.

- Auth
  - POST /api/auth/register
  - POST /api/auth/login

- Videos
  - GET /api/videos
  - GET /api/videos/:id
  - POST /api/videos
  - PUT /api/videos/:id
  - DELETE /api/videos/:id

- Comments
  - POST /api/videos/:id/comments
  - GET /api/videos/:id/comments

- Likes
  - POST /api/videos/:id/likes
  - DELETE /api/likes/:id

- Playlists
  - POST /api/playlists
  - GET /api/playlists/:id
  - PATCH /api/playlists/:id

Example cURL to create a comment (authenticated):
curl -X POST "http://localhost:4000/api/videos/<videoId>/comments" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great video!"}'

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

## Acknowledgements

This project was built as a learning project by following the
**Chai aur Javascript Backend | Hindi** series by **Chai aur Code**.

Special thanks to **Hitesh Choudhary** and the Chai aur Code team
for the detailed backend development tutorials and guidance.

The original tutorial covers building a YouTube-like backend using
technologies such as Node.js, Express.js, MongoDB, Mongoose, JWT,
and other backend tools.

### Learning Resource

- **YouTube Playlist:** [Chai aur Javascript Backend | Hindi](https://www.youtube.com/watch?v=EH3vGeqeIAo&list=PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW)
- **Channel:** [Chai aur Code](https://www.youtube.com/@chaiaurcode)
- **Original Backend Repository:** [chai-backend](https://github.com/hiteshchoudhary/chai-backend)

This repository is my learning implementation of the concepts taught
in the series, with my own debugging, testing, and modifications
made while developing the project.

## License

This project is for learning and educational purposes.

---

**Author**: [Sujal](https://github.com/sujal-guptaa)  
**Repository**: [backed-project](https://github.com/sujal-guptaa/backed-project)
