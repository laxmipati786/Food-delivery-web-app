import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const sendOTP = async (user) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpAttempts = 0; // Reset attempts
    // Expire in 5 minutes
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log("Sending OTP to:", user.email);

    const message = `Your OTP is ${otp}. It will expire in 5 minutes.`;

    await sendEmail({
        email: user.email,
        subject: 'Your Verification Code',
        html: `<p>${message}</p>`,
    });

    return otp;
};

export const signup = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists and is verified' });
        }

        if (user && !user.isVerified) {
            user.name = name;
            user.password = password; // pre-save hook will hash it
            user.phone = phone;
            const otp = await sendOTP(user);
            const responseData = { requiresVerification: true, email: user.email, message: 'OTP sent successfully to your phone/email.' };
            return res.status(200).json(responseData);
        }

        user = await User.create({ name, email, password, phone, role, isVerified: false });
        const otp = await sendOTP(user);
        const responseData = { requiresVerification: true, email: user.email, message: 'OTP sent successfully to your phone/email.' };
        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otpAttempts >= 3) {
            return res.status(400).json({ message: 'Maximum OTP attempts exceeded. Please request a new one.' });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            user.otpAttempts += 1;
            await user.save();
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                const otp = await sendOTP(user);
                const responseData = { requiresVerification: true, email: user.email, message: 'Please verify your email. A new OTP has been sent.' };
                return res.status(403).json(responseData);
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                phone: user.phone
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const resendEmailOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up again.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const otp = await sendOTP(user);
        const responseData = { success: true, message: 'A new OTP has been sent to your email.' };
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        // Expire in 5 minutes
        user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        console.log("Sending OTP to:", user.email);

        const message = `Your OTP is ${otp}. It will expire in 5 minutes.`;

        await sendEmail({
            email: user.email,
            subject: 'Your Verification Code',
            html: `<p>${message}</p>`,
        });

        const responseData = { success: true, message: 'Password reset OTP sent to email' };
        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordOTP !== otp || user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword; // Will automatically get hashed due to pre-save hook in User model
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
