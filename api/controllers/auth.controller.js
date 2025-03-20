import jwt from 'jsonwebtoken';
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from '../utils/emailService.js';

/* */
export const signup = async (req, res, next) => {
    const { step, email, otp, username, password } = req.body;


    try {

        if (step === 'sendOTP') {
            if (!email) {
                return next(errorHandler(400, 'Email is required'));
            }

            // 1. Check if user exists, if not, create a new user
            let user = await User.findOne({ email });
            if (user && user.isRegistered) {
                return next(errorHandler(400, 'User already exists')); e
            };
            if (!user) {
                user = new User({ email });
                await user.save();
            }

            // 2. Generate OTP and send it to the user's email
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

            // 3. Save the OTP and its expiry date in the database
            await User.updateOne(
                { email },
                { otp: otpCode, otpExpires },
                { upsert: true }
            );

            // 4. Send the OTP to the user's email
            const subject = 'Your OTP Code';
            const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
        }
        .email-body p {
            line-height: 1.6;
            margin: 10px 0;
        }
        .otp-code {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            background: #f9f9f9;
            border: 1px solid #dddddd;
            border-radius: 4px;
        }
        .email-footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
        .email-footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Placement Diaries</h1>
        </div>
        <div class="email-body">
            <p>Dear User,</p>

            <p>Your OTP code is:</p>

            <div class="otp-code">${otpCode}</div>

            <p>This code will expire in 10 minutes.</p>

            <p>If you did not request this code, please ignore this email.</p>

            <p>Best regards,<br>Placement Diaries Team</p>
        </div>
        <div class="email-footer">
            <p>Need help? Contact us at <a href="mailto:placementdiariestkiet@gmail.com">placementdiariestkiet@gmail.com</a>.</p>
        </div>
    </div>
</body>
</html>
`;

            sendEmail(email, subject, htmlContent);
            return res.json({ success: true, message: 'OTP sent to your email' });
        }

        if (step === 'verifyOTP') {
            if (!email || !otp) {
                return next(errorHandler(400, 'Email and OTP are required'));
            }

            // 1. Check if the OTP is valid and not expired
            const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });
            if (!user) {
                return next(errorHandler(400, 'Invalid or expired OTP'));
            }

            // 2. If the OTP is valid, remove it from the database
            await User.updateOne({ email }, { otp: null, otpExpires: null });


            // 3. Return a success message
            return res.json({ success: true, message: 'OTP verified Successfully' });
        }

        if (step === 'setPassword') {
            if (!username || !email || !password) {
                return next(errorHandler(400, 'All fields are required'));
            }

            // 1. Hash the password
            const hashedPassword = bcryptjs.hashSync(password, 10);

            // 2. Update the user's information
            await User.updateOne(
                { email },
                {
                    username,
                    password: hashedPassword,
                    isRegistered: true,
                }
            );

            return res.json({ success: true, message: 'Signup successful!' });
        }

        return next(errorHandler(400, 'Invalid step'));
    } catch (error) {
        next(error);
    }
};

/* */
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin, canPost: validUser.canPost }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true
        }).json(rest);
    } catch (error) {
        return next(error);
    }
}

/*  */
export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            await User.updateOne({ email }, { isRegistered: true });
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, canPost: user.canPost }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
                isRegistered: true,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin, canPost: newUser.canPost }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
}