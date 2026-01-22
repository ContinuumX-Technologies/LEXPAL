// controllers/userAuth.controller.js

import User from "../models/user.model.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.util.js";

export const userSignup = async (req, res) => {
    try {
        const { first_name, last_name, email, password, city, state } = req.body;

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be atleast 6 characters" });
        }

        // Hash password
        const hashed = await hashPassword(password);

        // Create user
        const user = await User.create({
            first_name,
            last_name,
            email,
            password_hash: hashed,
            city,
            state
        });

        if (user) {
            const token = generateToken(user._id, "User");

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV != "development"

            });
        }



        return res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                _id: user._id,
                name: user.first_name,
                email: user.email,
                saved_lawyers: user.saved_lawyers
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};








export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Check password
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate token
        const token = generateToken(user._id, "User");

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV != "development"
        });

        return res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.first_name,
                email: user.email,
                saved_lawyers: user.saved_lawyers
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};