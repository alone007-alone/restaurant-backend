import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ======================
   🟢 TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ======================
   🔐 ADMIN LOGIN SYSTEM
====================== */

let token = "";
let menu = [];

const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    token = Math.random().toString(36);
    return res.json({ success: true, token });
  }

  res.json({ success: false });
});

function auth(req, res, next) {
  if (req.headers.authorization === token) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

/* ======================
   📦 MENU SYSTEM
====================== */

app.get("/menu", (req, res) => {
  res.json(menu);
});

app.post("/menu", auth, (req, res) => {
  menu.push(req.body);
  res.json({ success: true });
});

app.delete("/menu/:index", auth, (req, res) => {
  menu.splice(req.params.index, 1);
  res.json({ success: true });
});

/* ======================
   📧 RESERVATION EMAIL
====================== */

app.post("/reserve", async (req, res) => {
  const { name, phone, date, time, people, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "🍽️ New Table Reservation",
      html: `
        <h2>New Reservation</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>People:</b> ${people}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ======================
   🚀 SERVER START
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});