const express = require("express");
const app = express();
app.use(express.json());
require('dotenv').config();
const cors = require("cors");
app.use(cors({ origin: 'http://localhost:5173' }));
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cron = require("node-cron");


const PORT = 3123;
const JWT_SecretKey = '275fgrb';
const exp = 60 * 60 * 1;

// connect to mongodb
const { MongoClient } = require("mongodb");
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'Users';
const mongodbColl = 'User';


// middleware verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token missing" });
    
    jwt.verify(token, JWT_SecretKey, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'nicoardiansyah43@gmail.com',
        pass: 'uzxs exjx audy mzfm'
    },
});

// delete user automaticly every 1 menute
cron.schedule('* * * * *', async () => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);

        const now = new Date();

        await myColl.deleteMany({
            isVerified: false,
            verificationExpires: { $lt: now }
        });

        await myColl.updateMany(
            {
                isVerified: true,
                verificationExpires: { $lt: now }
            },
            {
                $set: {
                    verificationCode: null,
                    verificationExpires: null
                }
            }
        );

    } catch (e) {
        console.log(e)
    } finally {
        await client.close()
    }
});

app.get("/", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);
        
        const userData = await myColl.findOne({
            username
        });

        res.send(userData)
        

    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
});

app.post("/register", async (req, res) => {
    try {
        await client.connect();
        const { username, password, email } = req.body;
        const code = crypto.randomBytes(3).toString("hex");
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);
    
        // username validate
        const user = await myColl.findOne({
            username
        });

        const findEmail = await myColl.findOne({
            email
        });

        // username validation
        if (!username.trim()) return res.status(400).json({message: "username is required"});
        if (!username.replace(/\s/g, "")) return res.status(400).json({message: "username must not contain spaces"});
        if (user && user.isVerified) return res.status(400).json({message: "Username has ben taken"});

        // email validation
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return res.status(400).json({message: "email is required"});
        if (!emailCheck.test(email)) return res.status(400).json({message: "format email is invalid"});
        if (findEmail && user.email) return res.status(400).json({message: "Email has ben taken"});

        // password validation
        const passTest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}/;
        if (!password.trim()) return res.status(400).json({message: "Password id required"});
        if (password.length < 6) return res.status(400).json({message: "Password must min 6 characters"});
        if (!passTest.test(password)) return res.status(400).json({message: "Password must contain letters and numbers"});

        // hash password
        const hashedPassword = bcrypt.hashSync(password, 5);
        
        // verification process
        await myColl.insertOne({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationCode: code,
            verificationExpires: new Date(Date.now() + 10 * 60 * 1000)
        });

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL_USER,
            to: email,
            subject: "*** REGISTRATION VERIFICATION CODE ***",
            text: `
            ********************************************
            ***   Your Verification Code ${code}  ***
            ****    Code expired in 10 minute    ****
            ********************************************
            `
        });
    
        return res.status(201).json({message: "Registration User Success"});

    } catch (e) {
        console.log(e)
    } finally {
        await client.close()
    }

});

app.post('/verify', async (req, res) => {
    try {
        const { username, code } = req.body;
        await client.connect();
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);

        const user = await myColl.findOne({
            username
        });
        
        if (!user) return res.status(400).json({ message: "verification code has expired" });
        if (user.verificationCode !== code) return res.status(400).json({message : "verification code is invalid"});

        if (user.verificationCode === code && user.verificationExpires > new Date()) {
            await myColl.updateOne(
                { username }, 
                {
                    $set: {
                        isVerified: true,
                        verificationCode: null,
                        verificationExpires : null
                    }
                }
            );
        };

        return res.status(200).json({message: "Succes Created User"});

    } catch (e) {
        console.log(e)
    } finally {
        await client.close()
    }
});

app.post("/login", async (req, res) => {
    try {
        await client.connect();
        const { username, password } = req.body
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);

        // validate username
        const findUser = await myColl.findOne({
            username
        });

        // username validation
        if (!username.trim()) return res.status(400).json({message: "username is required"});
        if (!findUser) return res.status(400).json({message: "username not found"});

        // password validation
        const isPasswordValid = bcrypt.compareSync(password, findUser.password);
        if (!password.trim()) return res.status(400).json({message: "password is required"});
        if (!isPasswordValid) return res.status(400).json({message: "Wrong Password"});

        const token = jwt.sign({username}, JWT_SecretKey, {expiresIn: exp});
        return res.status(200).json({token});

    } catch (e) {
        console.log(e);
    } finally {
        await client.close()
    }
});

app.get('/loggedin', verifyToken, (req, res) => {
    return res.status(200).json({
        message: "Your loggedin",
        user: req.user});
});

app.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        await client.connect();
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const code = crypto.randomBytes(3).toString("hex");

        const findEmail = await myColl.findOne({
            email
        });

        // email validation
        if (!email.trim()) return res.status(400).json({message: "email is required"});
        if (!findEmail) return res.status(400).json({message: "email not found"});
        if (!emailCheck.test(email)) return res.status(400).json({message : "format email is invalid"});

        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL_USER,
            to: email,
            subject: "*** RESET PASSWORD VERIFICATION CODE ***",
            text: `
            ********************************************
            ***   Your Verification Code ${code}  ***
            ****    Code expired in 10 minute    ****
            ********************************************
            `
        });

        await myColl.updateOne(
            { email },
            {
                $set: {
                    verificationCode: code,
                    verificationExpires: new Date(Date.now() + 10 * 60 * 1000)
                }
            }
        );

        return res.status(200).json({message: "verification code sended"});

    } catch (e) {
        console.log(e)
    } finally {
        await client.close()
    }
});

app.post('/updatepassword', async (req, res) => {
    try {
        const { email, code, password } = req.body;

        await client.connect();
        const db = client.db(dbName);
        const myColl = db.collection(mongodbColl);

        const user = await myColl.findOne({
            email
        });
        // code validation
        if (!code.trim()) return res.status(400).json({ message: "field is required" });

        // email validation
        const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return res.status(400).json({message: "email is required"});
        if (!emailCheck.test(email)) return res.status(400).json({message: "format email is invalid"});
        if (user.email !== email) return res.status(400).json({message: "email not found"});

        // password validate
        const passTest = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}/;
        if (!password.trim()) return res.status(400).json({message: "Password id required"});
        if (!passTest.test(password)) return res.status(400).json({message: "Password must contain letters and numbers"});
        if (password.length < 6) return res.status(400).json({message: "Password must min 6 characters"});
        
        // verification
        if (new Date() > user.verificationExpires) return res.status(400).json({message: "Verification code expired"});
        if (user.verificationCode !== code) return res.status(400).json({message: "Verification code invalid"});

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (isPasswordValid) return res.status(400).json({ message: "New password cannot use previous password" });

        const hashedPassword = bcrypt.hashSync(password, 5);

        if (user.verificationCode === code && user.verificationExpires > new Date()) {
            await myColl.updateOne(
                { email:user.email },
                {
                    $set:
                    {
                        password: hashedPassword,
                        verificationCode: null,
                        verificationExpires: null
                    }
                }
            )
        }

        return res.status(200).json({message: "Changed Password Success"});

    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log("Server running at PORT:", PORT);
});