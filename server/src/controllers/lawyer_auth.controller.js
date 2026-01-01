// controllers/lawyerAuth.controller.js

import Lawyer from "../models/lawyer.model.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.util.js";

export const lawyerSignup = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            experience,
            city,
            state,
            pincode,
            office_address,
            bar_license,
            AOR_certified,
            court_eligibility,
            languages,
            specialities,
            description
        } = req.body;

        // Check if lawyer exists
        const existing = await Lawyer.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashed = await hashPassword(password);

        // Create lawyer
        const lawyer = await Lawyer.create({
            first_name,
            last_name,
            email,
            password_hash: hashed,
            experience,
            city,
            state,
            pincode,
            office_address,
            bar_license,
            AOR_certified,
            court_eligibility,
            languages,
            specialities,
            description
        });

        if (lawyer) {
            const token =  generateToken(lawyer._id, "Lawyer");

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV != "development"
            });
        }

        return res.status(201).json({
            message: "Lawyer signup successful",
            lawyer: {
                name: lawyer.first_name,
                email: lawyer.email,

            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const lawyerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const lawyer = await Lawyer.findOne({ email });
        if (!lawyer) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await comparePassword(password, lawyer.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token =  generateToken(lawyer._id, "Lawyer");

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV != "development"
        });

        return res.json({
            message: "Login successful",

            lawyer: {

                name: lawyer.first_name,
                email: lawyer.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
        console.log(error);
    }
};