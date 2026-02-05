# 🚀 HireNFix Backend

A comprehensive **worker booking platform backend** built for scalability, security, and seamless user experience.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSONwebtokens)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io)
![Render](https://img.shields.io/badge/Deploy-Render-FF6C37?style=for-the-badge)


-------------------------------------------------------------------------------------------------------------------------------------------------

## 📚 Overview

HireNFix is a modern backend for a worker booking platform, designed to **connect users with skilled workers nearby**.  

It allows users to:  
- Search workers by skills and location  
- Request bookings and manage their profiles  
- View QR codes for verification or attendance  

Workers can:  
- Set their skills, daily rates, and availability  
- Accept or reject booking requests  
- Receive notifications for bookings and profile updates  

The backend follows best practices for **security, scalability, and maintainability**, making it developer-friendly and production-ready.

-------------------------------------------------------------------------------------------------------------------------------------------------

## ✨ Features

### 🔑 Authentication & User Management
- ✅ Signup/Login with email & password  
- ✅ Email OTP verification  
- ✅ JWT-based authentication with refresh token flow  
- ✅ Password reset via email  
- ✅ Role-based access control (user & worker)  

### 🛠 Worker & Booking Management
- Workers can set skills, daily rates, and availability  
- Users can search workers by skills & geolocation  
- Users can request bookings  
- Workers can accept/reject bookings  
- Notifications for booking requests and updates  

### 📸 QR Code & Cloudinary Integration
- QR code generated for each user at signup  
- Uploaded to Cloudinary and linked to user profile  
- Used for verification and attendance tracking  

### 🔔 Notifications
- Stored in MongoDB  
- Includes booking requests, acceptance/rejection, and profile updates  

### 🔒 Security & Validation
- Password hashing with bcrypt (salt rounds = 12)  
- Input validation for email, password, and dates  
- JWT stored in secure HTTP-only cookies  
- Role-based route protection  
- CORS configured for frontend  

-------------------------------------------------------------------------------------------------------------------------------------------------

## 🛠 Tech Stack

| Layer           | Technology                             |
|-----------------|----------------------------------------|
| Backend         | Node.js, Express.js                    |
| Database        | MongoDB Atlas                          |
| Authentication  | JWT, bcrypt, Email OTP via Nodemailer  |
| Storage         | Cloudinary                             |
| Deployment      | Render                                 |
| Dev Tools       | Postman, Nodemon                       |

---

## 📁 Project Structure

```
hire-and-fix-backend/
│── app.js            # Entry point
│── controllers/      # API handlers
│── middlewares/      # Auth, roles
│── models/           # MongoDB schemas
│── routes/           # Express routers
│── utils/            # JWT, OTP, QR code, email utils
│── profile check/
│── package.json
│── package-lock.json
│── .gitignore
│── README.md
```

-------------------------------------------------------------------------------------------------------------------------------------------------

## ⚙️ Environment Variables
```
Set these in `.env`:

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
```


## 🔧 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/AbhishekYadav262005/hire-and-fix-backend.git
cd hire-and-fix-backend

# Install dependencies
npm install

# Run the backend server
npm run dev       # Or: node app.js



## 💻 Usage

1. **Register** as a **user** or **worker**  
2. **Log in** with your credentials  

**For Users:**  
- Search for workers  
- Request bookings  
- Pay to complete the booking  

**For Workers:**  
- Set skills, daily rate, and availability  
- Accept or reject booking requests  
- Track notifications  

---

## 🧪 Testing

- Manual testing is recommended using **Postman** or any similar REST client  
- Make sure all required `.env` variables are set before testing  
- Test endpoints for:
  - Authentication (signup, login, email verification, password reset)  
  - Worker search by skills and geolocation  
  - Booking requests and acceptance/rejection  
  - Notifications and QR code functionality  

---

## 🤝 Contributing

1. **Fork** the repository  
2. Create a **feature branch**:  

```bash
git checkout -b feature/amazing-feature

3.Commit your changes:

```bash
git commit -m "Add some amazing feature"

4.Push to your branch:

```bash
git push origin feature/amazing-feature

5.Open a Pull Request to the main repository



👨‍💻 Author
Abhishek Yadav

GitHub: AbhishekYadav262005
LinkedIn:abhishekyadav262005ab
Email: abhishek.yourgmail@gmail.com

---------------------------------------------------------------------------------------------------------

                        Built with ❤️ for scalable and secure backend solutions

