const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 8080;


const authRoutes = require("./routes/authRoutes/allauthroutes.js");
const profileRoutes = require("./routes/platformroutes/profiledata.js");
const bookingRoutes = require("./routes/platformroutes/bookingroutes.js");
const searchRoutes = require("./routes/platformroutes/serchroutes.js");
const paymentRoutes = require("./routes/platformroutes/paymentroutes");
const reviewRoutes = require("./routes/platformroutes/reviewRoutes");
const usermediaRoutes=require("./routes/platformroutes/usermedia");
const ExpressError = require("./utils/error/expresserror.js");

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin:process.env.FRONT_END_URL, 
    credentials: true,
  })
);


const dbUrl = process.env.ATLAS_DBURL;
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
}
main();

app.get("/", (req, res) => {
  res.send("App is listening");
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "process.env.FRONT_END_URL",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Registered user:", userId);
  });

  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) onlineUsers.delete(userId);
    }
    console.log("User disconnected:", socket.id);
  });
});


app.set("io", io);
app.set("onlineUsers", onlineUsers);

app.use("/", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", searchRoutes);
app.use("/api", paymentRoutes);
app.use("/api", reviewRoutes);
app.use("/api/userMedia",usermediaRoutes);

app.use((err, req, res, next) => {
  const { status = 500, message = "Some Internal Error" } = err;

  if (!(err instanceof ExpressError)) {
    console.error("Unhandled Error:", err);
  }

  res.status(status).json({ error: message });
});


server.listen(port, () => console.log(`Server running on port ${port}`));
