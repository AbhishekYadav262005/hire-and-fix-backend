🚀 HireNFix Backend

🌟 About HireNFix
HireNFix is a scalable and secure Node.js backend for a modern worker booking platform.
It enables users to discover skilled workers nearby, request bookings, and manage profiles seamlessly — while giving workers a platform to showcase skills, set rates, and accept jobs.

The backend handles:
Authentication & Authorization with JWT
Email OTP verification for security
Worker search using skills & geolocation
Booking request management with notifications
QR code generation for user verification
HireNFix is designed with best practices for security, scalability, and maintainability, making it both developer-friendly and production-ready.


✨ Features-

🔑 Authentication & User Management :
✅ Signup/Login with email & password
✅ Email verification via OTP
✅ JWT-based auth with refresh tokens
✅ Password reset flow via email
✅ Role-based access (user & worker)

🛠 Worker & Booking Management
🔹 Workers can set skills, daily rates, and availability
🔹 Users can search workers by skills & location
🔹 Users can request bookings
🔹 Workers can accept or reject bookings
🔹 Notifications for booking requests and updates

📸 QR Code & Cloudinary Integration
Each user has a QR code generated at signup
QR uploaded to Cloudinary and linked to user profile
Used for verification or attendance

🔔 Notifications
Stored in MongoDB
Booking request, acceptance, rejection, profile updates

🔒 Security & Validation
Password hashing with bcrypt (salt rounds = 12)
Input validation (email, password, date)
JWT stored in secure HTTP-only cookies
Role-based route protection
CORS configuration for frontend

🛠 Tech Stack
Layer	                              Technology
Backend	                            Node.js, Express.js
Database	                          MongoDB Atlas
Auth & Security	                    JWT, bcrypt, OTP via Nodemailer
Storage	                            Cloudinary
Deployment	                        Render
Dev Tools	                          Postman, Nodemon


📂 Project Structure

hire-and-fix-backend/
├── app.js                  # Entry point
├── controllers/            # API handlers
├── middlewares/            # Auth, roles, profile check
├── models/                 # MongoDB schemas
├── routes/                 # Express routers
├── utils/                  # JWT, OTP, QR code, email utils
├── package.json
├── package-lock.json
├── .gitignore
└── README.md


⚙️ Environment Variables

Set these in .env or Render dashboard:

ATLAS_DBURL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
FRONT_END_URL=*
NODE_ENV=production


📦 Setup 

git clone https://github.com/AbhishekYadav262005/hire-and-fix-backend.git
cd hire-and-fix-backend
npm install
npm run dev       # Or: node app.js


🔐 Security Highlights

Passwords hashed using bcrypt
Email OTP verification for signup
JWT tokens stored securely in HTTP-only cookies
Role-based route protection


🎯 Future Improvements

Persistent OTP storage in DB
WebSocket notifications
Refresh token flow fully implemented
Automated testing & CI/CD

📧 Contact

Author: Abhishek Yadav
Email: abhishek.yourgmail@gmail.com
GitHub: AbhishekYadav262005
