import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendError } from '../utils/ErrorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return sendError(res, 409, 'User already exists'); // 409 Conflict
        }

        // 2. Hash the password (using Bcrypt as suggested in the data model)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Create the user
        // Valid roles: 'admin', 'bu', 'viewer'
        const newUser = await User.create({
            name,
            email,
            password_hash: passwordHash,
            role: role || 'viewer', // Default to read-only access
        });

        // 4. Generate JWT
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

// After
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return sendError(res, 401, 'Invalid Credentials');
        }

        const token = jwt.sign(
            { id: user.id, name: user.role, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return res.status(200).json({ token, user: { id: user.id, name: user.role, role: user.role } });
    } catch (error) {
        return res.status(500).json({ message: 'Login failed', error });
    }
};