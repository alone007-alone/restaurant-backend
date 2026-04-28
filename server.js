import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
            subject: "New Reservation",
            html: `
                <h2>New Booking</h2>
                <p>Name: ${name}</p>
                <p>Phone: ${phone}</p>
                <p>Date: ${date}</p>
                <p>Time: ${time}</p>
                <p>People: ${people}</p>
                <p>Message: ${message}</p>
            `
        });

        res.json({ success: true });

    } catch (err) {
        console.log("EMAIL ERROR:", err);
        res.json({ success: false });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));