# 📚 Edgeify - Learning Management Platform

Welcome to **Edgeify**, a modern, full-stack learning management platform designed to connect teachers and students. Edgeify allows instructors to publish high-quality educational courses, manage curriculums, and analyze student engagement. Students can search and filter courses, track their completion progress, view their watch history, and rate their learning experiences.

---

## 🚀 Key Features

### 🔐 User & Session Management
- **Role-Based Auth**: Distinct workflows and dashboards for **Students** and **Teachers**.
- **Secure Authentication**: Password hashing using `bcrypt` and session authorization utilizing JSON Web Tokens (`JWT` Access & Refresh tokens).
- **Persistent Sessions**: Tokens are securely stored in client-side cookies (`httpOnly` cookies).
- **Dynamic Profile Updates**: Users can update details and upload custom avatars (profile pictures) backed by Cloudinary.

### 👨‍🏫 Instructor (Teacher) Tools
- **Course Publisher**: Build, edit, and delete courses with details such as level, price, language, and custom thumbnails.
- **Curriculum & Video Management**: Upload educational videos and thumbnails directly, linking them to specific courses.
- **Category Creator**: Create and group courses under custom learning categories.
- **Instructor Dashboard**: Monitor publication status and course enrollments.

### 🧑‍🎓 Student Experience
- **Interactive Course Browser**: Search for courses by query, filter courses dynamically via category chips, and see popular or trending courses.
- **Custom Video Player**: Watch lectures inside an integrated playback component (powered by `react-player`).
- **Progress Tracking**: Tracks video completion state per user. Automatically calculates overall course completion percentages.
- **Watch History**: Save watched videos to a user history database, allowing students to resume learning or review past lessons.
- **Reviews & Ratings**: Students can leave ratings and reviews. The average course rating is calculated automatically to help other students choose.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 | Client library with modern functional components & hooks |
| | Vite | Fast, modern build tool for frontend assets |
| | React Router DOM v7 | Client-side routing and page navigation |
| | Tailwind CSS | Utility-first styling for premium dark/glassmorphic layouts |
| | React Player | Media engine for smooth video playback |
| | Axios | HTTP client for making API requests to the backend |
| **Backend** | Node.js / Express | Fast, unopinionated web server environment |
| | MongoDB & Mongoose | Document database & Object Data Modeling (ODM) library |
| | Cloudinary | Cloud-based media management for uploading thumbnails and videos |
| | Multer | Middleware for handling multipart/form-data (file uploads) |
| | JWT / Bcrypt | Secure token generation and password encryption |

---

## 📁 Repository Structure

```
Edgeify/
├── backend/
│   ├── public/              # Temporary uploads directory
│   ├── src/
│   │   ├── controllers/     # API request handlers (users, courses, videos, reviews, etc.)
│   │   ├── db/              # Database connection logic
│   │   ├── middlewares/     # JWT authentication & Multer file upload middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions mapped to controllers
│   │   ├── utils/           # Utility classes (ApiError, ApiResponse, asyncHandler, Cloudinary)
│   │   ├── app.js           # Express app setup and middleware configuration
│   │   ├── constants.js     # Shared backend constants (DB Name, cookie options)
│   │   └── index.js         # Entry point (connects DB & starts server listener)
│   ├── .env                 # Backend environment variables configuration
│   └── package.json         # Node.js backend dependencies & scripts
│
└── frontend/
    ├── public/              # Static assets
    ├── src/
    │   ├── assets/          # Shared visual elements
    │   ├── Components/      # Reusable UI widgets and sub-page dashboard components
    │   ├── context/         # AuthContext state provider (holds session user object)
    │   ├── Pages/           # Primary page views (Home, CourseDetail, Login, Profile, etc.)
    │   ├── Services/        # Route guard elements (ProtectedRoute, PublicOnlyRoute)
    │   ├── App.css          # App-wide global styles
    │   ├── App.jsx          # Route paths mapping & router declaration
    │   ├── index.css        # Tailwind directives and custom variables
    │   └── main.jsx         # App mounting point with Context wrappers
    ├── .env                 # Frontend local environment configuration
    └── package.json         # Frontend configuration & dependencies
```

---

## 🗄️ Database Schema & Models

Edgeify uses MongoDB with Mongoose. Below are the key data models and their schemas:

### 1. User (`User`)
Stores account credentials, profile details, and role classifications.
- `username` (String, Unique, Indexed)
- `fullName` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (String: `'student'` or `'teacher'`)
- `profile_Pic` (String, Cloudinary secure URL)
- `bio` (String)
- `refreshToken` (String)

### 2. Course (`Course`)
Defines course metadata, level, pricing, and references the owner.
- `title` (String, Indexed)
- `description` (String)
- `thumbnail` (String, Cloudinary URL)
- `price` (Number)
- `level` (String)
- `language` (String)
- `duration` (String)
- `teacher_id` (ObjectId ➔ `User`)
- `category_id` (ObjectId ➔ `Category`)
- `average_rating` (Number, default 0)

### 3. Video (`Video`)
Represents lectures or lessons uploaded to a specific course.
- `title` (String, Indexed)
- `description` (String)
- `video_url` (String, Cloudinary media URL)
- `thumbnail` (String, Cloudinary URL)
- `duration` (String)
- `course_id` (ObjectId ➔ `Course`)
- `teacher_id` (ObjectId ➔ `User`)

### 4. Category (`Category`)
Taxonomies under which courses are classified.
- `category_name` (String, Unique, Indexed)
- `description` (String)
- `thumbnail` (String, Cloudinary URL)
- `user_id` (ObjectId ➔ `User` - instructor who created the category)

### 5. Enrollment (`Enrollment`)
Represents a student's registration in a course.
- `user_id` (ObjectId ➔ `User`)
- `course_id` (ObjectId ➔ `Course`)
- `progress_percentage` (Number, default 0)

### 6. Progress (`Progress`)
Detailed checklist tracking which videos a user has completed.
- `user_id` (ObjectId ➔ `User`)
- `video_id` (ObjectId ➔ `Video`)
- `isCompleted` (Boolean, default false)

### 7. History (`History`)
Tracks student's watch history.
- `user_id` (ObjectId ➔ `User`)
- `video_id` (ObjectId ➔ `Video`)

### 8. Review (`Review`)
Ratings and textual reviews left by students.
- `user_id` (ObjectId ➔ `User`)
- `course_id` (ObjectId ➔ `Course`)
- `rating` (Number, scale 1-5)
- `review` (String)

---

## 🔌 API Documentation (Backend Endpoints)

All endpoints are prefixed with `/api/v1`.

### User & Authentication (`/user`)
- `POST /user/register` - Create a new user account (supports profile picture upload)
- `POST /user/login` - Authenticate credentials and receive cookies
- `POST /user/logout` - Clear cookies and invalidate session 🔒
- `GET /user/current-user` - Fetch authenticated user schema 🔒
- `POST /user/refresh-token` - Renew expired Access token
- `PATCH /user/change-password` - Update account password 🔒
- `PATCH /user/profile` - Update bio, name, and email 🔒
- `PATCH /user/change-profilePic` - Replace avatar on Cloudinary 🔒

### Courses (`/course`)
- `GET /course/search` - Search courses using text query string
- `GET /course/popular` - Retrieve highly rated or featured courses
- `GET /course/:course_id` - Fetch course data by database ID
- `GET /course/category/:category_id` - Fetch courses grouped under a specific category
- `GET /course/teacher/my-courses` - Fetch courses published by the logged-in teacher 🔒
- `POST /course/create/:category_id` - Create a new course 🔒
- `PATCH /course/update-details/:course_id` - Modify title, price, descriptions, etc. 🔒
- `PATCH /course/update-thumbnail/:course_id` - Update thumbnail image 🔒
- `DELETE /course/delete/:course_id` - Delete course record and content 🔒

### Categories (`/category`)
- `GET /category` - Fetch list of all active categories
- `GET /category/:category_id` - Fetch details of a single category
- `POST /category/create` - Create a new course category 🔒
- `PATCH /category/update-details/:category_id` - Modify category metadata 🔒
- `PATCH /category/update-thumbnail/:category_id` - Replace category cover image 🔒
- `DELETE /category/delete/:category_id` - Remove a category 🔒

### Videos (`/video`)
- `GET /video/:video_id` - Retrieve video details
- `GET /video/course/:course_id` - List all videos linked to a course
- `GET /video/teacher/my-videos` - List all videos uploaded by the logged-in teacher 🔒
- `POST /video/upload/:course_id` - Upload video file and thumbnail to Cloudinary 🔒
- `PATCH /video/update-details/:video_id` - Modify video titles and description 🔒
- `PATCH /video/update-thumbnail/:video_id` - Upload new video thumbnail 🔒
- `PATCH /video/update-video/:video_id` - Replace the raw video file 🔒
- `DELETE /video/delete/:video_id` - Remove video from course and Cloudinary 🔒

### Enrollments (`/enrollment`)
- `POST /enrollment/enroll/:course_id` - Enroll student in a course 🔒
- `GET /enrollment/my-enrollments` - List all courses current student is enrolled in 🔒
- `GET /enrollment/is-enrolled/:course_id` - Check if student is enrolled in a specific course 🔒
- `GET /enrollment/students/:course_id` - List students enrolled in a teacher's course 🔒

### Student Progress (`/progress`)
- `PATCH /progress/complete/:video_id` - Mark video as complete (recalculates overall course percentage) 🔒
- `PATCH /progress/incomplete/:video_id` - Mark video as incomplete 🔒
- `GET /progress/completed-videos` - Get list of completed videos for the logged-in student 🔒

### Watch History (`/history`)
- `POST /history/create/:video_id` - Add a video to watch history 🔒
- `GET /history/myHistory` - Get student's watch history 🔒
- `DELETE /history/removeVideo/:video_id` - Remove single item from watch history 🔒
- `DELETE /history/clearHistory` - Clear entire watch history 🔒

### Reviews & Ratings (`/review`)
- `POST /review/create/:course_id` - Create a course review and rating 🔒
- `GET /review/allReviews/:course_id` - Publicly fetch all reviews for a course
- `GET /review/myReview/:course_id` - Fetch student's own review for a course 🔒
- `PATCH /review/update/:review_id` - Edit review text/rating 🔒
- `DELETE /review/delete/:review_id` - Delete review 🔒

### Dashboards (`/dashboard`)
- `GET /dashboard/student` - Aggregate data for student progress, history, and active courses 🔒
- `GET /dashboard/teacher` - Aggregate numbers, course stats, and student signups for instructors 🔒

*Note: 🔒 indicates that endpoint requires a valid JWT Token via headers or cookie.*

---

## ⚙️ Environment Configuration

You must create a `.env` file in the `backend/` directory, and verify endpoints configuration in `frontend/`.

### Backend Configuration (`backend/.env`)
Create a file named `.env` in the `backend/` directory:
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# JWT Configuration
ACCESS_TOKEN_SECRET=your_jwt_access_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Integration (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Configuration (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:
```env
VITE_PORT=3001
VITE_API_BASE_URL=http://localhost:3001
```

For production builds, set `VITE_API_BASE_URL` in `frontend/.env.production` to point to your live hosted API backend (e.g., Render, Heroku, etc.).

---

## ⚙️ Setup and Installation

### Prerequisites
Make sure you have Node.js (v18+) and MongoDB installed on your system.

### Step 1: Clone the Repository
```bash
git clone https://github.com/AadrshPandey/Edgeify-A-Learning-Platform.git
cd Edgeify-A-Learning-Platform
```

### Step 2: Set up the Backend
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables by copying the template parameters above into a new `.env` file.
4. Run the development server:
   ```bash
   npm run dev
   ```
   The server will start, connect to MongoDB, and listen on the configured port (default `3001`).

### Step 3: Set up the Frontend
1. Open a new terminal session and navigate into the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the local environment in `.env`.
4. Spin up the Vite development server:
   ```bash
   npm run dev
   ```
5. Click the local URL generated in the terminal (usually `http://localhost:5173`) to launch the application.

---

## 📝 License
This project is licensed under the ISC License.

## 👤 Author
Developed with ❤️ by **Aadrsh Pandey**.
