import express from 'express';
import database from './db/connect.js'
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb'
import cors from 'cors'
import nodemailer from 'nodemailer'

dotenv.config()
const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL);
await client.connect();

app.use(express());
app.use(express.json());
app.use(cors());
database();

app.get('/', function (req, res) {
    res.send('Welcome to siva tata APP')
})

app.post('/sendemail', async function (req, res) {

    try {
        const { name, phno, area, message } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.MYEMAIL,
            subject: "Requesting a vehicle",
            html: `
                <h2>Customer Name: ${name}</h2>
                <h2>Phone Number: ${phno}</h2>
                <h2>Area: ${area}</h2>
                <h2>Message: ${message}</h2>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error:", error);
                res.status(500).json({ status: 500, message: "Email not sent" });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ status: 200, message: "Email sent successfully" });
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ status: 500, message: "Server error" });
    }
})
app.get('/', cors(), (req, res) => {

})


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));